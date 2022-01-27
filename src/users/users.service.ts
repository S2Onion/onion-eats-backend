import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
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

            const token = this.jwtService.sign(user.id);
            // JWT 토큰 만들어서 리턴
            return { ok: true, token: token };
        } catch (e) {
            return { ok: false, error: e };
        }
    }

    async findById(id: number): Promise<User> {
        return this.usersRepository.findOne({ id: id });
    }

    async editProfile(userId: number, { email, password }: EditProfileInput): Promise<User> {
        const user = await this.findById(userId);
        if (!user) { // 조회된 User 정보가 없을 경우
            throw new BadRequestException('Data not found');
        }
        if (email) { // Email 정보가 업데이트되도록 전달되었을 경우
            user.email = email;
        }
        if (password) { // 변경을 위한 패스워드 정보가 전달되었을 경우
            user.password = password;
        }
        return this.usersRepository.save(user);
    }
}
