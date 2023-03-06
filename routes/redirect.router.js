import { Router } from "express";
import { redirectLink } from "../controllers/redirect.controler.js";

const router = Router();

router.get('/:nanoLink', redirectLink)

export default router;