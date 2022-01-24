import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "src/users/users.service";
import { JwtService } from "./jwt.service";

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if ('x-jwt' in req.headers) {
            const token = req.headers['x-jwt']; // Header에서 토큰 값 확인
            try {
                const decoded = this.jwtService.verify(token.toString()); // 토큰 유효한지 확인
                if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
                    const user = await this.userService.findById(decoded['id']); // 토큰의 ID 값에 대한 유저 정보 조회
                    req['user'] = user; // Request에 유저 정보 추가
                }
            } catch (e) {
                console.error(e);
            }
        }
        next();
    }
}