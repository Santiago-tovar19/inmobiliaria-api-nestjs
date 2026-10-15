import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User } from 'src/users/entities/user.entity';
import { Role } from '../roles/entities/role.entities';
import { PasswordReset } from './entities/password-reset.entity';

import { ApiResponse } from '../common/api-response.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SignInDto } from './dto/sing-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(PasswordReset)
    private readonly passwordResetRepo: Repository<PasswordReset>,

    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // SIGN IN (LOGIN)
  // =========================
  async signIn(dto: SignInDto): Promise<ApiResponse> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: ['role', 'role.modules'],
    });

    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      return {
        message: 'Usuario o contraseña invalida',
        data: null,
        statusCode: 422,
      };
    }

    const token = this.jwtService.sign({ userId: user.id });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, password: passUser, ...safeUser } = user;

    return {
      message: 'Autenticacion exitosa',
      statusCode: 200,
      data: {
        accessToken: token,
        tokenType: 'bearer',
        user: {
          ...safeUser,
          role,
          modules: role.modules,
          verified: user.email_verified_at ? 1 : 0,
        },
      },
    };
  }

  // =========================
  // CHECK AUTH
  // =========================
  async checkAuth(userId: number): Promise<{
    user: any;
    accessToken: string;
  }> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role', 'role.modules'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Laravel-style: módulos vienen planos
    const modules = user.role?.modules ?? [];

    // Generar NUEVO access token (igual que Laravel refresh)
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        role: user.role?.id,
      },
      {
        expiresIn: '1d',
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, role, ...safeUser } = user;

    return {
      user: {
        ...safeUser,
        role,
        modules,
        verified: user.email_verified_at ? 1 : 0,
      },
      accessToken,
    };
  }

  // =========================
  // FORGOT PASSWORD (LARAVEL 1:1)
  // =========================
  async forgotPassword(dto: ForgotPasswordDto): Promise<ApiResponse> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      return {
        message: 'Usuario no existe',
        data: null,
        statusCode: 422,
      };
    }

    // Generar token (igual que Laravel)
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);

    // Eliminar tokens previos
    await this.passwordResetRepo.delete({ email: dto.email });

    // Guardar nuevo token
    await this.passwordResetRepo.save({
      email: dto.email,
      token: hashedToken,
    });

    // ⚠️ AQUÍ va el envío de correo (Mailer / Notifications)
    // Laravel: Password::broker()->createToken($user)

    return {
      message: 'Correo enviado',
      statusCode: 200,
      data: token, // 👈 Laravel también devuelve token
    };
  }

  // =========================
  // CHECK PASSWORD RESET TOKEN
  // =========================
  async checkPasswordResetToken(
    email: string,
    token: string,
  ): Promise<ApiResponse> {
    const reset = await this.passwordResetRepo.findOne({
      where: { email },
    });

    if (!reset || !(await bcrypt.compare(token, reset.token))) {
      throw new UnauthorizedException('Token invalido');
    }

    // Expiración: 10080 minutos (7 días) igual que Laravel
    const diff = Date.now() - new Date(reset.created_at).getTime();
    const minutes = diff / 1000 / 60;

    if (minutes > 10080) {
      throw new UnauthorizedException('Token expirado');
    }

    return {
      message: 'Token valido',
      statusCode: 200,
      data: true,
    };
  }

  // =========================
  // RESET PASSWORD
  // =========================
  async resetPassword(
    email: string,
    token: string,
    password: string,
  ): Promise<ApiResponse> {
    // Validar token primero
    await this.checkPasswordResetToken(email, token);

    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    user.password = await bcrypt.hash(password, 10);
    await this.userRepo.save(user);

    // Eliminar token usado
    await this.passwordResetRepo.delete({ email });

    return {
      message: 'Contraseña actualizada',
      statusCode: 200,
      data: null,
    };
  }
}
