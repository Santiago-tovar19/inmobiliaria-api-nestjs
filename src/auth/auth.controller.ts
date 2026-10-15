import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sing-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ApiResponse } from '../common/api-response.interface';
import { ApiResponseService } from 'src/common/helpers/api-response.helper';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly api_response: ApiResponseService,
  ) {}

  // =========================
  // SIGN IN
  // POST /auth/sign-in
  // =========================
  @Post('sign-in')
  async signIn(@Body() dto: SignInDto): Promise<ApiResponse> {
    return this.authService.signIn(dto);
  }

  // =========================
  // CHECK AUTH
  // POST /auth/check-auth
  // =========================
  @UseGuards(JwtAuthGuard)
  @Post('check-auth')
  async checkAuth(@CurrentUser('userId') userId: number): Promise<any> {
    const data = await this.authService.checkAuth(userId);

    return this.api_response.success('Refrescado exitosamente', data);
  }

  // =========================
  // FORGOT PASSWORD
  // POST /auth/forgot-password
  // =========================
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<ApiResponse> {
    return this.authService.forgotPassword(dto);
  }

  // =========================
  // CHECK PASSWORD RESET TOKEN
  // POST /auth/check-password-reset-token
  // =========================
  @Post('check-password-reset-token')
  async checkPasswordResetToken(
    @Body()
    body: {
      email: string;
      token: string;
    },
  ): Promise<ApiResponse> {
    return this.authService.checkPasswordResetToken(body.email, body.token);
  }

  // =========================
  // RESET PASSWORD
  // POST /auth/reset-password
  // =========================
  @Post('reset-password')
  async resetPassword(
    @Body()
    body: {
      email: string;
      token: string;
      password: string;
    },
  ): Promise<ApiResponse> {
    return this.authService.resetPassword(
      body.email,
      body.token,
      body.password,
    );
  }
}
