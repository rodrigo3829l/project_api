import { Router } from "express";
import { addMoreProducts, addProduct, getProducto, getProductos } from "../controllers/productos.controller.js";
import { requireToken } from "../middlewares/requireToken.js";


const router = Router();
router.post('/', addProduct);
router.get('/:id', getProducto);
router.get('/', getProductos);
router.post('/add/', addMoreProducts);
//falta el de agregar un numero determinado de productos

export default router;