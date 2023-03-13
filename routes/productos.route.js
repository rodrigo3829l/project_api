import { Router } from "express";
import { addProduct, getProducto, getProductos } from "../controllers/productos.controller.js";
import { requireToken } from "../middlewares/requireToken.js";


const router = Router();
router.post('/', requireToken, addProduct);
router.post('/:id', getProducto);
router.get('/', getProductos);

export default router;