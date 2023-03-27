import mongoose from "mongoose";

const {Schema, model} = mongoose;

const sistemaSchema = new Schema({
    temperatura : String,
    humedad : String,
    luz: String,
    agua: String,
    nutrientes: String,
    riego : String
});

export const Sistema = model('Sistema', sistemaSchema);