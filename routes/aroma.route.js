import { Router } from "express";
import { addAroma, getAroma, getAromas, updateAroma } from "../controllers/aroma.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { bodyAromaValidator, paramLinkValidator } from "../middlewares/validatosManager.js";

const router = Router()

//añade mas aromas
router.post('/', requireToken, bodyAromaValidator, addAroma )
//Extrae la lista de los aromas
router.get('/', getAromas);
//actualiza un aroma mediante el id
router.patch('/:id', requireToken, paramLinkValidator, bodyAromaValidator,  updateAroma);
//extrae un aroma en especifico
router.get('/:id', paramLinkValidator, getAroma);

export default router;