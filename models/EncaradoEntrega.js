import mongoose from "mongoose";

const {Schema, model} = mongoose;


const encargadoSchema = new Schema({
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref:"users",
        require: true,
    },
    estado : {
        type: String,
        required : true,
        enum : ['Disponible', 'No disponible']
    },
    paquetes : Number
});

export const Encargado = model('Encargado', encargadoSchema);