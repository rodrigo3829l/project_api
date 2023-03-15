import { Router } from "express";
import { addQuestion, getQuestions } from "../controllers/question.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { bodyPreguntaValidator } from "../middlewares/validatosManager.js";

const router = Router();
//añade mas preguntas
router.post('/',  addQuestion );
//obtener lista de las preguntas
router.get('/', getQuestions)

export default router;