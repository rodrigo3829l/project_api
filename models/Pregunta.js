import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'

const preguntaSchema = new mongoose.Schema({
    pregunta:{
        type: String,
        required: true,
        unique : true,
        trim : true,
        index : {unique : true}
    }
})

export const Pregunta = mongoose.model('Pregunta', preguntaSchema);