import { Router } from "express";
import { addRol, getRol, getRoles } from "../controllers/roles.controller.js";
import { requireToken } from "../middlewares/requireToken.js";

const router = Router();
//Agregar roles
router.post('/', addRol)
//consultar Roles
router.get('/', getRoles);
//consultar un rol en especifico
router.get('/:rol', getRol )
//Consultar roles con permisos especificos


export default router;