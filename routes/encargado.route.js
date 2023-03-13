import { Router } from "express";
import { addEncargado, delEncargado, updateStateEncargado } from "../controllers/encargado.controller.js";
const router = Router();

router.post('/', addEncargado);
router.patch('/:id', updateStateEncargado);
router.delete('/:id', delEncargado);
export default router;