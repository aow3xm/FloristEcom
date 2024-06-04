import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IUser } from 'src/shared/interfaces/jwt-payload.interface';
import { LoginDto } from 'src/modules/user/dto/login.dto';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { verifyPassword } from 'src/utils/bcrypt.util';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(loginDto.email);
    try {
      const isValid = await verifyPassword(loginDto.password, user.password);
      if (!isValid) {
        throw new HttpException('Invalid Credentials.', 401);
      }
      return await this.createToken(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Something went wrong while login.', 500);
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findOne(forgotPasswordDto.email);
    try {
      const forgotToken = await this.createToken(user, '15m');
      await this.deleteForgotToken(user.id);
      await this.db.forgotPassword.create({
        data: {
          userId: user.id,
          token: forgotToken.access_token,
        },
      });
      await this.mailService.sendResetPasswordEmail(
        forgotPasswordDto.email,
        forgotToken.access_token,
      );
      return null;
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong while sending email.', 500);
    }
  }

  async createToken(
    user: User,
    expire: string = process.env.JWT_EXPIRE,
  ): Promise<{ access_token: string }> {
    const payload: IUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: expire,
      }),
    };
  }

  async deleteForgotToken(userId: string): Promise<void> {
    try {
      await this.db.forgotPassword.delete({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Something went wrong while deleting forgot token.',
        500,
      );
    }
  }
}
