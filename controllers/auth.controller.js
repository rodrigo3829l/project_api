import { User } from "../models/Users.js";
import jwt from 'jsonwebtoken'
import { generateRefreshToken, generateToken, TokenVerificationErrors } from "../utils/tokenManager.js";

export const register = async (req, res) => {     
    const {name, app, apm, fechaNacimiento, numCasa, userName, password, celphone, email} = req.body;
    try {
        let user = await User.findOne({email});
        if(user) throw {code: 11000};

        user = new User({
            name,
            app,
            apm,
            fechaNacimiento,
            numCasa,
            userName,
            password,
            celphone,
            email
        });

        
        await user.save();
        //jwt token 
        const {token, expiresIn} = generateToken(user.id);  
        generateRefreshToken(user.id, res)

        return res.status(201).json({token, expiresIn});
    } catch (error) {
        //console.log(error)
        if(error.code === 11000){
            return res.status(400).json({error: 'Ya existe el usuario, o el correo'})
        }
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
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


        return res.json({token, expiresIn})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean()
        return res.json({_id: user._id, userName: user.userName, email: user.email})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Error de servidor'})
    }
}

export const refreshToken  = (req, res) => {
    try {
        const {token, expiresIn} = generateToken(req.uid);  
        return res.json({token, expiresIn})
    } catch (error) {
        console.log(error.message);
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
        const {name, app, apm, fechaNacimiento, numCasa, userName, password, celphone, email} = req.body;

        const user = await User.findById(id);

        if(!user) return res.status(404).json({error: "No existe el usuario"});


        user.name = name;
        user.app = app;
        user.apm = apm;
        user.userName= userName;
        user.fechaNacimiento = fechaNacimiento;
        user.numCasa = numCasa;
        user.password = password;
        user.celphone = celphone;
        user.email= email;
        
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