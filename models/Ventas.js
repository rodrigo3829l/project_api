import mongoose from "mongoose";

const {Schema, model} = mongoose;

const ventasSchema = new Schema({
    fecha : {
        type: String,
        required : true
    },
    hora : {
        type : String,
        required: true
    },
    idUsuario :{
        type: Schema.Types.ObjectId,
        ref:"users",
        required: true,
    },
    paquetes : [{
            idPaquete : {
                type: Schema.Types.ObjectId,
                ref:"paquetes",
                required: true,
            },
            cantidad: {
                type : Number,
                required : true,
            },
            total : Number
    }],
    total: Number,
    encargadoEntrega: {
        type: Schema.Types.ObjectId,
        ref:"encargados",
        required: true,
    }
})
export const Ventas = model ('Ventas', ventasSchema);

const getVentasSchema = new Schema({
    fecha : {
        type: String,
        required : true
    },
    hora : {
        type : String,
        required: true
    },
    usuario :{
        type: String,
        required: true,
    },
    paquetes : [{
            paquete : {
                type: String,
                required : true,
                trim : true,
            },
            cantidad: {
                type : Number,
                required : true,
            },
            total : Number
    }],
    total: Number,
    encargadoEntrega: String
})
export const GetVentas = model ('GetVentas', getVentasSchema)