import { Router } from "express";
import { deflate } from "zlib";
import { addVenta, getVentaForDate, getVentaForId, getVentas, getVentasEntreHoras, getVentasPorFechaYHora, updateStateForSale } from "../controllers/ventas.controller.js";

const router = Router();

router.post('/', addVenta)
router.get('/:id', getVentaForId)
router.get('/', getVentas)
router.post('/date', getVentaForDate)
router.post('/hora', getVentasEntreHoras);
router.post('/fechaHora', getVentasPorFechaYHora);
router.post('/update', updateStateForSale);


export default router;