import HttpException from '../exceptions/http-exception';
import ContactRepository from '../repository/contact-repository';

class ContactService {
    private contactRepository: ContactRepository;

    constructor(contactRepository: ContactRepository) {
        this.contactRepository = contactRepository;
    }

    async createContact(
        id: number,
        contact: {
            name: string;
            surname: string;
            email: string;
            phone: string;
        },
    ) {
        let client;
        try {
            client = await this.contactRepository.beginTransaction();
            const newContact = await this.contactRepository.create(id, contact);
            await this.contactRepository.commitTransaction(client);
            return newContact;
        } catch (error) {
            if (client) {
                await this.contactRepository.rollbackTransaction(client);
            }
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, (error as Error).message);
        }
    }

    async updateContact(
        id: number,
        contact: {
            name: string;
            surname: string;
            email: string;
            phone: string;
        },
    ) {
        let client;
        try {
            client = await this.contactRepository.beginTransaction();
            const updatedContact = await this.contactRepository.update(id, contact);
            await this.contactRepository.commitTransaction(client);
            return updatedContact;
        } catch (error) {
            if (client) {
                await this.contactRepository.rollbackTransaction(client);
            }
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, (error as Error).message);
        }
    }

    async getAllContacts(id: number) {
        return this.contactRepository.getAllContacts(id);
    }

    async getContactById(id: number) {
        return this.contactRepository.getContactById(id);
    }

    async deleteContact(id: number) {
        return this.contactRepository.delete(id);
    }
}

export default ContactService;
