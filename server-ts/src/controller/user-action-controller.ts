import { Request, Response } from 'express';
import UserActionService from '../service/user-action-service';
import HttpException from '../exceptions/http-exception';

class UserActionController {
    private userActionService: UserActionService;

    constructor(userActionService: UserActionService) {
        this.userActionService = userActionService;
    }   

    async changePassword(req: Request, res: Response) {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        try {
            const result = await this.userActionService.changePassword(+id, { currentPassword, newPassword });
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async deleteAccount(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const result = await this.userActionService.deleteAccount(+id);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}

export default UserActionController;