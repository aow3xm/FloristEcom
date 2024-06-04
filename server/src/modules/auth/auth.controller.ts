import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/modules/user/dto/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { LoginDto } from 'src/modules/user/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.userService.createOne(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
