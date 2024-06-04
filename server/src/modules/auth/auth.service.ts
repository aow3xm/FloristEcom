import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IUser } from 'src/interfaces/jwt-payload.interface';
import { LoginDto } from 'src/modules/user/dto/login.dto';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { verifyPassword } from 'src/utils/bcrypt.util';
@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
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

  private async createToken(user: User) {
    const payload: IUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
