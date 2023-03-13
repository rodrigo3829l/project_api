import mongoose from "mongoose";

const {Schema, model} = mongoose;

const paqueteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: {unique: true}
    },
    descripcion :{
        type: String,
        required: true,
        trim: true,
    },
    precio:{
        type: String,
        required : true,
        trim : true,
    },
    img:{
        type: String,
        require: true,
        trim: true
    },
    productos : [{
            type: Schema.Types.ObjectId,
            ref:"productos",
            require: true,
        
    }],
    existencia :{
        type: String,
        required : true,
        trim : true,
    },
    estado: {
        type: String,
        required: true,
        trim: true,
        enum: ['Disponible', 'No disponible']
    }
})

export const Paquetes = model('Paquetes', paqueteSchema);

const getPaqueteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: {unique: true}
    },
    descripcion :{
        type: String,
        required: true,
        trim: true,
    },
    precio:{
        type: String,
        required : true,
        trim : true,
    },
    img:{
        type: String,
        require: true,
        trim: true
    },
    productos : [{
            type: String,
            require: true,
    }],
    existencia :{
        type: String,
        required : true,
        trim : true,
    },
    estado: {
        type: String,
        required: true,
        trim: true,
        enum: ['Disponible', 'No disponible']
    }
})

export const GetPaquetes = model('GetPaquetes', getPaqueteSchema);