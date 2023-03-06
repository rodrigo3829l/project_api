import { Pregunta } from "../models/Pregunta.js";

export const addQuestion = async (req, res) => {
    const {pregunta} = req.body;
    try {
        let addPregunta = await Pregunta.findOne({pregunta});
        if(addPregunta) throw {code: 11000};

        addPregunta = new Pregunta({pregunta});
        const newQuestion = await addPregunta.save();
        return res.status(201).json({newQuestion})
        
    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({error: 'Ya existe la pregunta'})
        }
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
    }
}

export const  getQuestions = async (req, res) =>{
    try {
        const questions = await Pregunta.find();
        return res.json({questions})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'Error de servidor preguntas'})
    }
}

//No se pueden eliminnar las preguntas mi actualizarlas pues es el medio por el cual se recupera la contraseña