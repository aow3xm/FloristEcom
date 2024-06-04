import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RegisterDto } from 'src/modules/user/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/utils/bcrypt.util';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}
  async createOne(registerDto: RegisterDto): Promise<void> {
    try {
      const pwd = await hashPassword(registerDto.password);
      await this.db.user.create({
        data: { ...registerDto, password: pwd },
      });
      return null;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new HttpException('Email already existed.', 409);
      }
      throw new HttpException(
        'Something went wrong while trying to register.',
        500,
      );
    }
  }

  async findOne(email: string): Promise<User> {
    try {
      const user = await this.db.user.findUnique({ where: { email } });
      if (!user) {
        throw new HttpException('User not found.', 404);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Something went wrong while trying to find.',
        500,
      );
    }
  }
}
