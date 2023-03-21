import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name : String,
    app : String,
    apm : String,
    fechaNacimiento: Date,
    numCasa : String,
    direccion : [{
        calle : String,
        colonia : String,
        ciudad : String,
        estado : String,
        cp : String
    }],
    userName : {
        type: String,
        required: true,
        unique : true,
        trim: true,
        index : {unique : true},
    } ,
    password : {
        type: String,
        required: true,
    } ,
    celphone : String,
    email : {
        type: String,
        required: true,
        unique : true,
        trim: true,
        index : {unique : true},
    },
    sexo : {
        type: String,
        enum : ["Masculino", "Femenino"]
    },
    pregunta : String,
    respuesta : String,
    img:{
        public_id: String,
        secure_url: String
    },
    tipo: {
        type : String,
        enum : ['Admin', 'User', 'Gerent', 'Reparter']
    }
});

userSchema.pre("save", async function( next ){
    const user = this;

    if(!user.isModified('password')) return next();
    try {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password, salt);
        next();
    } catch (error) {
        console.log(error);
        throw new Error('Fallo el hash de contraseña');
    }
})

userSchema.methods.comparePassword = async function (candidatePassword){
    return await bcryptjs.compare( candidatePassword, this.password)
}

export const User = mongoose.model('User', userSchema)