import { Encargado, GetEncargado } from "../models/EncaradoEntrega.js";
import { User } from "../models/Users.js";

export const addEncargado = async (req, res) =>{
    const {idUsuario} = req.body;
    try {
        let encargado = await Encargado.findOne({idUsuario});
        if (encargado) throw {code: 1100};
        encargado = new Encargado({idUsuario, estado: "Disponible", paquetes : 10});
        const newEncargado = await encargado.save();
        return res.status(201).json({newEncargado})
    } catch (error) {
        console.log(error);
        if(error.code === 11000){
            return res.status(400).json({error: 'Ya existe el encargado'})
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

export const getEcargadoDisp = async (req, res) => {
    try {
        const encargados = await Encargado.find();
        if (!encargados) return res.status(400).json({error: "No hay pa"});
        let enca = [];
        let i;
        for ( i = 0 ; i < encargados.length; i ++){
            const user = await User.findById(encargados[i].idUsuario.toString());
            const newEncargado = new GetEncargado({
                usuario : user.name + " " + user.app + " " + user.apm,
                estado: encargados[i].estado,
                paquetes: encargados[i].paquetes,
                telefono: user.celphone
            })
            enca.push(newEncargado)
        }
        return res.status(200).json({enca})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Algo fallo en el servidor o la base de datos' })
    }
}
