import HttpException from "../exceptions/http-exception";
import AuthService from "../service/auth-service";
import { Request, Response } from "express";

class AuthController {

    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await this.authService.login(email, password);
            res.cookie("access_token", user.accessToken, { httpOnly: true });
            res.cookie("refresh_token", user.refreshToken, { httpOnly: true });
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }

    }

    async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;
            const user = await this.authService.register(username, email, password);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });

            }
        }

    }

    async verifyUser(req: Request, res: Response) {
        try {
            const token: string = req.cookies.access_token;
            const user = await this.authService.verifyUser(token);            
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }

    }

    async logout(_req: Request, res: Response) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.status(200).json({ message: "Logout successful" });
    }
}

export default AuthController;