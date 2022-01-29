import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(Verification) private readonly verificationRepository: Repository<Verification>,
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
            const user = await this.usersRepository.save(this.usersRepository.create({ email, password, role }))

            // 인증 코드 정보 생성
            await this.verificationRepository.save(this.verificationRepository.create({ user }));
            return { ok: true };
        } catch (e) {
            return { ok: false, error: 'Couldn\'t create account' };
        }
    }

    async login({ email, password }: LoginInput): Promise<{ ok: boolean, error?: string, token?: string }> {
        try {
            // Email로 User 정보 확인
            const user = await this.usersRepository.findOne({ email }, { select: ['id', 'password'] });
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
            user.emailVerified = false; // Email 정보를 업데이트 하였으므로 인증여부 false로 업데이트

            // 인증 코드 정보 생성
            await this.verificationRepository.save(this.verificationRepository.create({ user }));
        }
        if (password) { // 변경을 위한 패스워드 정보가 전달되었을 경우
            user.password = password;
        }
        return this.usersRepository.save(user);
    }

    async verifyEmail(code: string): Promise<boolean> {
        try {
            const verification = await this.verificationRepository.findOne({ code }, { relations: ['user'] }); // Code 정보 확인
            if (!verification) { // DB에 없는 코드일 경우 리턴 false
                throw new Error();
            }
            console.log(verification);
            verification.user.emailVerified = true; // 전달된 코드에 연결된 이메일 인증 여부 값 true로 업데이트
            this.usersRepository.save(verification.user);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
