import { Router } from "express";
import fileUpload from "express-fileupload";

import { addNumberPaquetes, addPaquetes, getPaquete, getPaquetes, updatePaquete } from "../controllers/paquete.controller.js";

const router = Router();

//añadir mas paquetes
router.post('/', fileUpload({useTempFiles: true, tempFileDir: './uplloads'}) , addPaquetes);
//obtener el detalle de un paquete
router.get('/:id', getPaquete);
//obtener el detalle de todos los paquetes
router.get('/', getPaquetes)
//actualizar los paquetes
router.post('/:id', updatePaquete);
//funcion de eliminacion de paquetes
router.patch('/', addNumberPaquetes )
export default router;