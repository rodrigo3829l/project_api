
import Usuarios from '../models/Usuarios.js';
import bcrypjs from 'bcryptjs';
import { generateOTP } from '../helpers/generateOTP.js';
import { emailRegistro, emailResetPassword } from '../helpers/sendMail.js';
import { sendSMS } from '../helpers/sendSMS.js';

const login = async (req, res) => {
    const { login, password } = req.body;
    try {
        //buscar por email o username o telefono

        const usuario = await Usuarios.findOne({ $or: [{ email: login }, { userName: login }, { telefono: login }] });

        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            return res.status(404).json(error.message)
        }

        //verificar password
        const passwordCorrecto = await bcrypjs.compare(password, usuario.password);

        if (!passwordCorrecto) {
            const error = new Error("Contraseña incorrecta");
            return res.status(400).json(error.message)
        }

        return res.status(200).json("Usuario logeado correctamente")

    } catch (error) {
        console.log(error);
    }
}

const register = async (req, res) => {
    const { nombre, apellido, userName, telefono, email, password } = req.body;

    try {
        //verificar si el usuario ya existe
        let usuario = await Usuarios.findOne({ $or: [{ email }, { userName }, { telefono }] });

        if (usuario) {
            const error = new Error("Usuario ya registrado");
            return res.status(400).json(error.message)
        }

        //generar codigo otp
        const codeOTP = generateOTP();

        //crear usuario
        usuario = new Usuarios({ nombre, apellido, userName, telefono, email, password, codeOTP });

        //hashear password
        const salt = await bcrypjs.genSalt(10);
        usuario.password = await bcrypjs.hash(password, salt);

        //guardar usuario
        await usuario.save();

        //enviar email
        await emailRegistro({ email, nombre, token: usuario._id, codeOTP });

        return res.status(200).json("Usuario registrado correctamente")

    } catch (error) {
        console.log(error);
    }
}

const forgotPasswordBySMS = async (req, res) => {
    const { telefono } = req.body;

    try {
        //buscar usuario
        const usuario = await Usuarios.findOne({ telefono });

        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            return res.status(404).json(error.message)
        }

        //generar codigo otp
        const codeOTP = generateOTP();

        //guardar codigo en usuario
        usuario.codeOTP = codeOTP;
        await usuario.save();

        //enviar sms
        await sendSMS(`+52${telefono}`, `Codigo: ${codeOTP}`);

        //regresar al usuario

        return res.json(usuario);

    } catch (error) {
        console.log(error);
    }
}


// restablecer password vía email 

const forgotPasswordByEmail = async (req, res) => {
    const { email } = req.body;
    try {
        //buscar usuario
        const usuario = await Usuarios.findOne({ email });

        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            return res.status(404).json(error.message)
        }
        //otp 
        const codeOTP = generateOTP();

        //guardar codigo en usuario

        usuario.codeOTP = codeOTP;
        await usuario.save();

        //enviar email

        await emailResetPassword({ email, nombre: usuario.nombre, token: usuario._id, codeOTP });

        return res.json(usuario);

    } catch (error) {
        console.log(error);
    }
}

//comprobar codigo otp

const comprobarCodigoOTP = async (req, res) => {
    const { id, codeOTP } = req.body;

    try {
        //buscar usuario
        const usuario = await Usuarios.findById(id);

        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            return res.status(404).json(error.message)
        }

        //comprobar codigo
        if (usuario.codeOTP !== codeOTP) {
            const error = new Error("Codigo incorrecto");
            return res.status(400).json(error.message)
        }

        return res.json(usuario);

    } catch (error) {
        console.log(error);
    }
}

// restablecer password 

const resetPassword = async (req, res) => {
    const { password, id } = req.body;

    try {
        //buscar usuario
        const usuario = await Usuarios.findById(id);

        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            return res.status(404).json(error.message)
        }

        //hashear password
        const salt = await bcrypjs.genSalt(10);
        usuario.password = await bcrypjs.hash(password, salt);

        //guardar usuario
        await usuario.save();

        return res.json("Password actualizado correctamente");

    } catch (error) {
        console.log(error);
    }
}


export {
    login,
    register,
    forgotPasswordBySMS,
    forgotPasswordByEmail,
    resetPassword,
    comprobarCodigoOTP
};

