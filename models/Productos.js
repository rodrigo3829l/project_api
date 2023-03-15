import mongoose from "mongoose";

const {Schema, model} = mongoose;

const productosSchema = new Schema({
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
    aroma:{
        type: Schema.Types.ObjectId,
        ref:"aromas",
        require: true,
    },
    existencia: {
        type: String,
        require: true,
        trim: true,
    },
    tipo: {
        type: String,
        require: true,
        trim: true,
        //enum : ["Jabon", "Desodorante"]
    },
    img:{
        type: String,
        require: true,
        trim: true
    },
    
    
});

export const Productos = model('Productos', productosSchema );


const getProductosSchema = new Schema({
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
    aroma:{
        type: String,
        trim: true,
    },
    existencia: {
        type: String,
        require: true,
        trim: true,
    },
    tipo: {
        type: String,
        require: true,
        trim: true,
    },
    img:{
        type: String,
        require: true,
        trim: true
    }
    
});

export const GetProductos = model('GetProductos', getProductosSchema );