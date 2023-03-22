import { Aroma } from "../models/Aroma.js";
import { GetProductos, Productos } from "../models/Productos.js";
import {uploadImage, deleteImage} from '../utils/cloudinary.js'
import fs from 'fs-extra';



export const addProductImg = async (req, res) => {
    const  {nombre, descripcion, aroma, existencia, tipo} = req.body;
    //console.log(aroma)

    try {
        const newProduct = new Productos ({
            nombre,
            descripcion,
            aroma ,
            existencia,
            tipo,
        });
        if(req.files?.img){
            const {public_id, secure_url} = await uploadImage(req.files.img.tempFilePath)
            newProduct.img ={
                public_id,
                secure_url  
            }
            fs.unlink(req.files.img.tempFilePath)
        }
        //console.log(newProduct)

        //const añadeProduct = await newProduct.save();
        return res.status(201).json({newProduct});
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Ya existe el producto' });
        }
        return res.status(500).json({ error: 'Algo fallo en el servidor o la base de datos' });
    }
}

export const addProduct = async (req, res) => {
    const  {nombre, descripcion, aroma, existencia, tipo} = req.body;
    try {
        let newProduct = await Productos.findOne({nombre});
        if(newProduct) throw {code: 11000};

        newProduct = new Productos ({
            nombre,
            descripcion,
            aroma ,
            existencia,
            tipo,
        });
        console.log(newProduct)
        if(req.files?.img){
            const {public_id, secure_url} = await uploadImage(req.files.img.tempFilePath)
            newProduct.img ={
                public_id,
                secure_url  
            }
            fs.unlink(req.files.img.tempFilePath)
        }

        //const añadeProduct = await newProduct.save();
        return res.status(201).json({newProduct});
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Ya existe el producto' });
        }
        return res.status(500).json({ error: 'Algo fallo en el servidor o la base de datos' });
    }
}

export const getProducto = async (req, res) =>{
    try {
        const {id} = req.params;
        const  {nombre, descripcion, aroma, existencia, tipo, img} = await Productos.findById(id);
        const getAroma = await Aroma.findById(aroma.toString());
        const strinAroma = getAroma.aroma
        const getProduct = new GetProductos({
            nombre, descripcion, aroma : strinAroma, existencia, tipo, img, _id :id.toString,
        })
        return res.status(201).json({getProduct});
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'Error de servidor'})
    }
}

export const getProductos = async (req, res) =>{
    try {
        
        const productos = await Productos.find();
        let i;
        let aromasId = [];
        for (i = 0; i < productos.length; i++){
            aromasId.push(productos[i].aroma.toString());
        }
        //console.log(aromasId[0]);
        let getProductos = [];
        for (i = 0; i < productos.length; i++){
            const {aroma} = await Aroma.findById(aromasId[i]);
            const getProduct = new GetProductos({
                nombre:productos[i].nombre, 
                descripcion: productos[i].descripcion, 
                aroma, 
                existencia: productos[i].existencia, 
                tipo : productos[i].tipo, 
                img: productos[i].img,
                 _id :productos[i]._id,
            })
            getProductos.push(getProduct)
        }
        return res.status(201).json({getProductos});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'Error de servidor'})
    }
}

export const addMoreProducts = async (req, res) =>{
    const {id, numero} = req.body;
    try {
        const producto = await Productos.findById(id);
        if(!producto) return res.status(400).json({error: "eL producto no existe en la bs"})
        producto.existencia = (Number(producto.existencia) + numero).toString();
        await producto.save();
        res.status(200).json({producto});
    } catch (error) {
        console.log(error)
    }
}