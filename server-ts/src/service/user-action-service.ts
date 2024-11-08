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

    async userUpdate(user: { username: string; email: string; password: string }) {
        try {
            const emailExists = await this.userActionRepository.checkEmailExists(user.email);
            if (emailExists) {
                throw new HttpException(400, 'Bu email adresi zaten kullanımda');
            }

            const hashedPassword = this.helper.hashPassword(user.password);

            const client = await this.userActionRepository.beginTransaction();

            try {
                const updatedUser = await this.userActionRepository.userUpdate({
                    ...user,
                    password: hashedPassword
                });

                await this.userActionRepository.commitTransaction(client);
                return updatedUser;
            } catch (error) {
                await this.userActionRepository.rollbackTransaction(client);
                throw error;
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Kullanıcı güncellenirken bir hata oluştu');
        }
    }

    async changePassword(id: number, data: { currentPassword: string; newPassword: string }) {
        try {
            const user = await this.userActionRepository.getUserById(id);

            if (!user) {
                throw new HttpException(404, 'User not found!');
            }

            // Mevcut şifreyi kontrol et
            const isPasswordValid = this.helper.comparePassword(data.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new HttpException(401, 'Wrong password!');
            }

            // Yeni şifreyi hashle
            const hashedNewPassword = this.helper.hashPassword(data.newPassword);

            // Transaction başlat
            const client = await this.userActionRepository.beginTransaction();

            try {
                const updatedUser = await this.userActionRepository.changePassword(id, hashedNewPassword);
                await this.userActionRepository.commitTransaction(client);
                return updatedUser;
            } catch (error) {
                await this.userActionRepository.rollbackTransaction(client);
                throw error;
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Password change failed');
        }
    }

    async deleteAccount(id: number) {
        try {
            const user = await this.userActionRepository.getUserById(id);

            if (!user) {
                throw new HttpException(404, 'User not found!');
            }

            // Transaction başlat
            const client = await this.userActionRepository.beginTransaction();

            try {
                const result = await this.userActionRepository.deleteAccount(id);
                await this.userActionRepository.commitTransaction(client);
                return result;
            } catch (error) {
                await this.userActionRepository.rollbackTransaction(client);
                throw error;
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Account deletion failed');
        }
    }
}

export default UserActionService;