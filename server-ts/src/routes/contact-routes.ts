import express from 'express';
import ContactRepository from '../repository/contact-repository';
import ContactService from '../service/contact-service';
import ContactController from '../controller/contact-controller';
import { verifyToken } from '../middleware/verify-token';
import { validateValidation } from '../middleware/verify-validation';
import { createContactSchema, updateContactSchema } from '../schemas/contact-schema';

const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const contactController = new ContactController(contactService);

const router = express.Router();

router.get('/', verifyToken, contactController.getAllContacts.bind(contactController));
router.get('/:id', verifyToken, contactController.getContactById.bind(contactController));
router.post(
    '/',
    validateValidation(createContactSchema),
    verifyToken,
    contactController.createContact.bind(contactController),
);
router.delete('/:id', verifyToken, contactController.deleteContact.bind(contactController));
router.put(
    '/:id',
    validateValidation(updateContactSchema),
    verifyToken,
    contactController.updateContact.bind(contactController),
);

export default router;
