import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    async createAccount({ email, password, role }: CreateAccountInput): Promise<{ ok: boolean, error?: string }> {
        try {
            // Email 중복 확인
            const exists = await this.usersRepository.findOne({ email });
            if (exists) { // Email 정보가 DB에 있을 경우 에러 처리
                return { ok: false, error: 'There is a user with that email already' };
            }

            // 계정 생성 및 비밀번호 암호화
            await this.usersRepository.save(this.usersRepository.create({ email, password, role }))
            return { ok: true };
        } catch (e) {
            return { ok: false, error: 'Couldn\'t create account' };
        }
    }

    async login({ email, password }: LoginInput): Promise<{ ok: boolean, error?: string, token?: string }> {
        try {
            // Email로 User 정보 확인
            const user = await this.usersRepository.findOne({ email });
            if (!user) {
                return { ok: false, error: 'User not found' };
            }

            // Password 정보 맞는지 확인
            const passwordCorrect = await user.checkPassword(password);
            if (!passwordCorrect) {
                return { ok: false, error: 'Wrong password' };
            }

            const token = jwt.sign({ id: user.id }, this.configService.get('SECRET_KEY'));
            // JWT 토큰 만들어서 리턴
            return { ok: true, token: token };
        } catch (e) {
            return { ok: false, error: e };
        }
    }
}
