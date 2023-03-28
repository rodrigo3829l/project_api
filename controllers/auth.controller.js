import { User } from "../models/Users.js";
import jwt from 'jsonwebtoken'
import fs from 'fs-extra';
import { generateRefreshToken, generateToken, TokenVerificationErrors } from "../utils/tokenManager.js";
import {uploadImage, deleteImage} from '../utils/cloudinary.js'
import { Sistema } from "../models/Sistemma.js";


export const sistemIng = async (req, res) =>{
    const {temperatura, humedad, luz, agua, nutrientes, riego} = req.body;
    try {
        let newSistem = await Sistema.findById('64217be9cc0f52e316a19f4e')
        newSistem.temperatura = temperatura;
        newSistem.humedad = humedad;
        newSistem.luz = luz;
        newSistem.agua = agua;
        newSistem.nutrientes= nutrientes;
        newSistem.riego = riego;
       
        await newSistem.save();
        return res.status(201).json({newSistem})
    } catch (error) {
        return res.status(401).json(error)
    }
}   

export const register = async (req, res) => {     
    const {name, app, apm, fechaNacimiento, numCasa,
         direccion, userName, password, celphone, 
         email, sexo, pregunta, respuesta, tipo} = req.body;
    try {
        //console.log(req.files)
        let user = await User.findOne({userName});
        if(user) throw {code: 11000};

        user = new User({
            name,
            app,
            apm,
            fechaNacimiento,
            numCasa,//
            direccion,//
            userName,
            password,
            celphone,
            email,
            sexo, //
            pregunta,// 
            respuesta,//
            tipo//
        });
        if(req.files?.img){
            const {public_id, secure_url} = await uploadImage(req.files.img.tempFilePath)
            user.img ={
                public_id,
                secure_url  
            }
            fs.unlink(req.files.img.tempFilePath)
        }

        
        await user.save();
        // jwt token 
        const {token, expiresIn} = generateToken(user.id);  
        generateRefreshToken(user.id, res)
        console.log(user)
        return res.status(201).json({token, expiresIn});
    } catch (error) {
        console.log(error)
        if(error.code === 11000){
            return res.status(400).json({error: 'Ya existe el usuario, o el correo'})
        }
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
    }
}

export const registerUser = async (req, res) => {     
    const {name, app, apm, userName, password, email, pregunta, respuesta, tipo} = req.body;
    try {
        console.log(req.files)
        let user = await User.findOne({userName});
        if(user) throw {code: 11000};

        user = new User({
            name,
            app,
            apm,
            fechaNacimiento : null,
            numCasa : null,
            direccion : [
                {
                    calle: null,
                    colonia: null,
                    estado: null,
                    cp: null
                }
            ],
            userName,
            password,
            celphone : null,
            email,
            sexo : null,
            pregunta,// 
            respuesta,//s
            tipo//
        });
        if(req.files?.img){
            const {public_id, secure_url} = await uploadImage(req.files.img.tempFilePath)
            user.img ={
                public_id,
                secure_url  
           }
            fs.unlink(req.files.img.tempFilePath)
        } 

        await user.save();
        //jwt token     
        const {token, expiresIn} = generateToken(user.id);  
        generateRefreshToken(user.id, res)
        console.log(user)
        return res.status(201).json({token, expiresIn});
    } catch (error) {
        console.log(error)
        if(error.code === 11000){
            return res.status(400).json({error: 'Ya existe el usuario, o el correo'})
        }
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
    }
}

export const imagen = async (req, res) =>{
    try {
        let public_id, secure_url;
        let img = {
            public_id,
            secure_url
        }
        if(req.files?.img){
            const {public_id: pid, secure_url: url} = await uploadImage(req.files.img.tempFilePath)
            public_id = pid;
            secure_url = url;
            img ={
                public_id,
                secure_url  
            }
            fs.unlink(req.files.img.tempFilePath)
            
        } 
        return res.status(200).json({img})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error})
    }
}


export const getUserForId = async (req, res) =>{
    const {id} = req.params;
    try {
        const user = await User.findById(id)
        if (!user) return res.status(400).json({error: 'Este usuario no existe'});
        return res.status(200).json({user}) 
    } catch (error) {
        console.log(error)
    }
}
export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        let user = await User.findOne({ userName/*, password*/ });

        if (!user) return res.status(403).json({error: 'No existe el usuario'})

        const respuestaPassword  = await user.comparePassword(password);
        if(!respuestaPassword) return res.status(403).json({error: 'Contraseña incorrecta'})

        //generar el jwt token
        const {token, expiresIn} = generateToken(user.id);  
        generateRefreshToken(user.id, res)
        console.log('login')
        console.log({token, expiresIn})
        return res.json({token, expiresIn})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean()
        return res.json({_id: user._id, userName: user.userName, email: user.email, tipo: user.tipo})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Error de servidor'})
    }
}

export const refreshToken  = (req, res) => {
    try {
        const {token, expiresIn} = generateToken(req.uid);  
        console.log('refresh')
        console.log({token, expiresIn})
        return res.json({token, expiresIn})
    } catch (error) {
        console.log('error en la funcion refresh token')
        console.log(error);
        return res.status(500).json({error: 'Error de servidor'})
    }
};

export const logout  = (req, res) =>{
    res.clearCookie('refreshToken');
    res.json({ok: true})
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.json({users})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'Error de servidor'})
    }
}

export const updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, app, apm, fechaNacimiento, numCasa,
            direccion, userName, password, celphone, 
            email, sexo, pregunta, respuesta, img, tipo} = req.body;

        const user = await User.findById(id);

        if(!user) return res.status(404).json({error: "No existe el usuario"});


        user.name = name;
        user.app = app;
        user.apm = apm;
        user.userName= userName;
        user.fechaNacimiento = fechaNacimiento;
        user.numCasa = numCasa;
        user.celphone = celphone;
        user.email= email;
        user.direccion = direccion;
        user.sexo =  sexo;
        user.img = img;
        user.pregunta = pregunta,
        user.respuesta= respuesta,
        user.password = password,
        user.tipo = tipo
        
        await user.save();

        return res.json({user})
    } catch (error) {
        console.log(error);
    }
}

export const removeUser = async (req, res) =>{
    try {
        const {id} = req.params;
        const user = await User.findOneAndDelete({_id: id});
        if(!user) return res.status(404).json({error: "No existe el usuario"});

        return res.json({user})

    } catch (error) {
        console.log(error);
        if(error.kind === "ObjectId"){
            res.status(403).json({error: 'Formato id incorrecto'})
        }
        res.status(500).json({error: 'error de servidor'});
    }
}


export const forgetPswd = async (req, res) =>{
    const {userName, email} = req.body;
    try {
        const user = await User.findOne({userName: userName, email: email});
        if(!user) return res.status(400).json({error: 'Usuario o email incorrectos'});
        return res.status(200).json({user})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error :"Error en el servidor o la bd"})
    }
}