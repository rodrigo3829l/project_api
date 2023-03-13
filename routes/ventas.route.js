import { Router } from "express";
import { deflate } from "zlib";
import { addVenta, getVentaForDate, getVentaForId, getVentasEntreHoras, getVentasPorFechaYHora } from "../controllers/ventas.controller.js";

const router = Router();

router.post('/', addVenta)
router.get('/:id', getVentaForId)
router.get('/date/:fecha', getVentaForDate)
router.post('/hora', getVentasEntreHoras);
router.post('/fechaHora', getVentasPorFechaYHora);


export default router;