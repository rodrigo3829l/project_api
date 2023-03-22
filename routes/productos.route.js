import { Router } from "express";
import fileUpload from "express-fileupload";
import { addMoreProducts, addProduct, addProductImg, getProducto, getProductos } from "../controllers/productos.controller.js";
import { requireToken } from "../middlewares/requireToken.js";


const router = Router();
router.post('/', fileUpload({useTempFiles: true, tempFileDir: './uplloads'}) , addProduct);
router.get('/:id', getProducto);
router.get('/', getProductos);
router.post('/add/', addMoreProducts);
//falta el de agregar un numero determinado de productos

export default router;