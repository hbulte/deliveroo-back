import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(user) {
    return await this.userRepository.findOne(user);
  }

  async signUp({ email, password }) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    try {
      return await this.userRepository.save({
        email: email,
        salt: salt,
        hash: hash,
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const newRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(id, { refreshToken: newRefreshToken });
  }

  async isRefreshTokenValid(id: string, refreshToken: string) {
    const user = await this.getUser(id);

    const testMatching = await bcrypt.compare(refreshToken, user.refreshToken);

    if (testMatching) {
      return user;
    }
  }

  async removeRefreshToken(id: string) {
    return await this.userRepository.update(id, { refreshToken: null });
  }
}
