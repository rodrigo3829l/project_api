import { Aroma } from "../models/Aroma.js";

export const addAroma = async (req, res) =>{
    const {aroma} = req.body;
    try {
        let addAroma = await Aroma.findOne({aroma});
        if(addAroma) throw {code: 11000};

        addAroma = new Aroma({aroma});
        const newAroma = await addAroma.save();
        return res.status(201).json({newAroma})
    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({error: 'Ya existe el aroma'})
        }
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
    }
}

export const getAromas = async (req, res) =>{
    try {
        const aromas = await Aroma.find();
        return res.json({aromas})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'Error de servidor aromas'})
    }
}

export const removeAroma= async (req, res) => {

}

export const updateAroma = async (req, res) =>{
    try {
        const {id} = req.params;
        const {aroma} =req.body;
        const upAroma = await Aroma.findById(id);
        if(!upAroma) return res.status(404).json({error: "No existe el aroma"});
        upAroma.aroma=aroma;
        await upAroma.save();
        return res.json({upAroma})
    } catch (error) {
        console.log(error)
    }
}

export const getAroma = async (req, res) => {
    try {
        const {id} = req.params;
        const aroma = await Aroma.findById(id);

        if(!aroma) return res.status(404).json({error: "No existe el aroma"});

        return res.json({aroma})
    } catch (error) {
        console.log(error)
    }
}