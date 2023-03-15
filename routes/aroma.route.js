import { Router } from "express";
import { addAroma, getAroma, getAromas, updateAroma } from "../controllers/aroma.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { bodyAromaValidator, paramLinkValidator } from "../middlewares/validatosManager.js";

const router = Router()

//añade mas aromas
router.post('/', addAroma )
//Extrae la lista de los aromas
router.get('/', getAromas);
//actualiza un aroma mediante el id
router.patch('/:id', updateAroma);
//extrae un aroma en especifico
router.get('/:id',  getAroma);

export default router;