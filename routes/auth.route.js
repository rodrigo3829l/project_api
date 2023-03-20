import {Router} from "express";
import { infoUser, login, register, refreshToken, logout, getUsers, updateUser, removeUser, forgetPswd, getUserForId} from "../controllers/auth.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";
import { bodyLoginVlidator, bodyRegisterValidator, bodyUpdateValidator, paramLinkValidator } from "../middlewares/validatosManager.js";
const router = Router();

//registrar un usuario, reibe un json y esta validado el cuerpo
router.post('/register', register);
//trae una lista con los usuarios de la bd
router.get('/users', getUsers);
//Hace un login mediante un token
router.post('/login',login);
//Muestra la informacion de un usuario en especifico
router.get('/protected', infoUser)
//refresca el token, pues este se cadica cada 15 min
router.get("/refresh" ,refreshToken, )
//cierra la sesion
router.get('/logout', logout)
//Actualiza a un usuario mediante el id
router.patch('/:id', updateUser)
//Elimina un usuario
router.delete('/:id', removeUser)

router.post('/forget', forgetPswd)

router.get('/:id', getUserForId)

export default router;