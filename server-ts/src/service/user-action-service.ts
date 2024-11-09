import HttpException from '../exceptions/http-exception';
import UserActionRepository from '../repository/user-action-repository';
import { Helper } from '../util/helper';

class UserActionService {
    private userActionRepository: UserActionRepository;
    private helper: Helper;

    constructor(userActionRepository: UserActionRepository) {
        this.userActionRepository = userActionRepository;
        this.helper = new Helper();
    }

    async userUpdate(id: number, user: { username: string; email: string; password: string }) {
        const client = await this.userActionRepository.beginTransaction();

        console.log(user);
        
        try {
            // Check if email exists for other users
            const emailExists = await this.userActionRepository.checkEmailExists(user.email, id);
            if (emailExists) {
                throw new HttpException(400, 'Bu email adresi zaten kullanımda');
            }

            const hashedPassword = this.helper.hashPassword(user.password);

            const updatedUser = await this.userActionRepository.userUpdate(id, {
                ...user,
                password: hashedPassword
            });

            await this.userActionRepository.commitTransaction(client);
            return updatedUser;

        } catch (error) {
            
            await this.userActionRepository.rollbackTransaction(client);

            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Kullanıcı güncellenirken bir hata oluştu');
        }
    }

    async changePassword(id: number, data: { currentPassword: string; newPassword: string }) {
        const client = await this.userActionRepository.beginTransaction();

        try {
            const user = await this.userActionRepository.getUserById(id);
            if (!user) {
                throw new HttpException(404, 'User not found!');
            }

            const isPasswordValid = this.helper.comparePassword(data.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new HttpException(401, 'Wrong password!');
            }

            const hashedNewPassword = this.helper.hashPassword(data.newPassword);
            const updatedUser = await this.userActionRepository.changePassword(id, hashedNewPassword);

            await this.userActionRepository.commitTransaction(client);
            return updatedUser;

        } catch (error) {
            await this.userActionRepository.rollbackTransaction(client);

            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Password change failed');
        }
    }

    async deleteAccount(id: number) {
        const client = await this.userActionRepository.beginTransaction();

        try {
            const user = await this.userActionRepository.getUserById(id);
            if (!user) {
                throw new HttpException(404, 'User not found!');
            }

            const result = await this.userActionRepository.deleteAccount(id);

            await this.userActionRepository.commitTransaction(client);
            return result;

        } catch (error) {
            await this.userActionRepository.rollbackTransaction(client);

            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Account deletion failed');
        }
    }
}

export default UserActionService;