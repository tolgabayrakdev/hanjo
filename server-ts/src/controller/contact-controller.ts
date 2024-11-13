import { Request, Response } from 'express';
import ContactService from '../service/contact-service';
import HttpException from '../exceptions/http-exception';

class ContactController {
    private contactService: ContactService;

    constructor(contactService: ContactService) {
        this.contactService = contactService;
    }

    async createContact(req: Request, res: Response) {
        try {
            const id = req.user.id;
            const contact = await this.contactService.createContact(id, req.body);
            res.status(201).json(contact);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getAllContacts(req: Request, res: Response) {
        try {
            const id = req.user.id;
            const result = await this.contactService.getAllContacts(id);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getContactById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const result = await this.contactService.getContactById(parseInt(id));
            if (!result) {
                throw new HttpException(404, 'Contact not found!');
            }
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async deleteContact(req: Request, res: Response) {
        try {
            await this.contactService.deleteContact(parseInt(req.params.id));
            res.status(204).send();
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async updateContact(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const user = req.body;
            const result = await this.contactService.updateContact(parseInt(id), user);
            if (!result) {
                throw new HttpException(404, 'Kullanıcı bulunamadı');
            }
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

export default ContactController;
