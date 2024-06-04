import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/modules/user/dto/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { LoginDto } from 'src/modules/user/dto/login.dto';
import { ForgotPasswordDto } from 'src/modules/auth/dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.userService.createOne(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('forgot')
  forgotToken(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}
