import HttpException from '../exceptions/http-exception';
import UserRepository from '../repository/user-repository';
import { Helper } from '../util/helper';

class AuthService {
    private userRepository: UserRepository;
    private helper: Helper;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.helper = new Helper();
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new HttpException(404, 'User not found!');
        }

        if (!this.helper.comparePassword(password, user.password)) {
            throw new HttpException(401, 'Wrong password!');
        }
        const accessToken = this.helper.generateAccessToken({
            username: user.username,
            id: user.id,
        });
        const refreshToken = this.helper.generateRefreshToken({
            username: user.username,
            id: user.id,
        });
        return { accessToken, refreshToken };
    }

    async register(username: string, email: string, password: string) {
        try {
            const existingUser = await this.userRepository.findByUsername(username);
            if (existingUser) {
                throw new HttpException(400, 'Username already exists!');
            }
            const existingEmail = await this.userRepository.findByEmail(email);
            if (existingEmail) {
                throw new HttpException(400, 'Email already exists!');
            }
            const hashedPassword = this.helper.hashPassword(password);
            const user = await this.userRepository.create({
                username,
                email,
                password: hashedPassword,
            });
            return user;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, (error as Error).message);
        }
    }

    async verifyUser(token: string) {
        try {
            const payload: any = this.helper.decodeToken(token);
            const user = await this.userRepository.getUserById(payload.id);
            if (!user) {
                throw new HttpException(404, 'User not found!');
            }
            return { username: user.username, email: user.email, role_id: user.role_id };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, (error as Error).message);
        }
    }
}

export default AuthService;
