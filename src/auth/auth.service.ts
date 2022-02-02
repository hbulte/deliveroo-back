import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email: email });
      const newHash = await bcrypt.hash(password, user.salt);
      if (newHash !== user.hash) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      const { hash, salt, ...response } = user;
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async genAccessToken(user: any) {
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      expiresIn: 900,
    });
    return token;
  }

  async genRefreshToken(user: any) {
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      expiresIn: 40000,
    });

    return token;
  }
}
