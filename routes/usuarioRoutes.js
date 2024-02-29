import express from 'express';

import { login, register, forgotPasswordBySMS, forgotPasswordByEmail, resetPassword, comprobarCodigoOTP } from '../controllers/usuarioController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgotPasswordBySMS', forgotPasswordBySMS);
router.post('/forgotPasswordByEmail', forgotPasswordByEmail);
router.post('/resetPassword', resetPassword);
router.post('/comprobarCodigoOTP', comprobarCodigoOTP);


export default router;