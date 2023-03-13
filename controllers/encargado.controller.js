import { Encargado } from "../models/EncaradoEntrega.js";

export const addEncargado = async (req, res) =>{
    const {idUsuario, estado} = req.body;
    try {
        let encargado = await Encargado.findOne({idUsuario});
        if (encargado) throw {code: 1100};
        encargado = new Encargado({idUsuario, estado});
        const newEncargado = await encargado.save();
        return res.status(201).json({newEncargado})
    } catch (error) {
        console.log(error);
        if(error.code === 11000){
            return res.status(400).json({error: 'Ya existe el aroma'})
        }
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
    }
}

export const updateStateEncargado = async (req, res) => {
    const {id} = req.params;
    try {
        const encargado = await Encargado.findById(id);
        if (!encargado) throw new Error ('No existe el usuario');
        if(encargado.estado === "Disponible"){
            encargado.estado = "No disponible";
        }else{
            encargado.estado = "Disponible";
        }
        await encargado.save();
        return res.json({encargado});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
    }
}

export const delEncargado = async (req, res) => {
    const { id } = req.params;
    try {
        const encargado = await Encargado.findById(id);
        if (!encargado) throw new Error('Este encargado no existe en la base de datos');
        await encargado.deleteOne();
        return res.json({ encargado })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Algo fallo en el servidor o la base de datos' })
    }
}
