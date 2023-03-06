import mongoose from "mongoose";

const {Schema, model} = mongoose;

const rolesSchema = new Schema({
    rol: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    permisos: [{
        type: String,
        required: true,
        trim: true,
        enum: ['Crear', 'Leer', 'Actualizar']
    }]
});

export const Roles = model('Roles', rolesSchema);
