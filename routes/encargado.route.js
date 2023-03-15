import { Router } from "express";
import { addEncargado, delEncargado, getEcargadoDisp, updateStateEncargado } from "../controllers/encargado.controller.js";
const router = Router();

router.post('/', addEncargado);
router.patch('/:id', updateStateEncargado);
router.delete('/:id', delEncargado);
router.get('/', getEcargadoDisp);
export default router;