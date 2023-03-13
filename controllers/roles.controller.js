import { Roles } from "../models/Roles.js";

export const addRol = async (req, res) => {
    const { rol, permisos } = req.body;
    try {
        let addRols = await Roles.findOne({rol});
        if (addRols) throw {code: 11000};

        addRols = new Roles ({rol, permisos});
        const newRol = await addRols.save();
        return res.status(201).json({newRol});
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Ya existe el rol' });
      }
      return res.status(500).json({ error: 'Algo fallo en el servidor o la base de datos' });
    }
  };

  export const getRoles = async (req, res) => {
    try {
        const roles = await Roles.find();
        return res.json({roles})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'Error de servidor'})
    }
  }
  export const getRol = async (req, res) => {
    try {
      const { rol } = req.params;
      console.log("Este es el rol : " + rol)
      const rolGet = await Roles.find({ rol: rol });
      if (rolGet.length === 0) {
        return res.status(404).json({ error: 'No se encontró el rol' });
      }
      return res.status(200).json({ rolGet });

    } catch (error) {
      console.log(error);
      if (error.kind === 'ObjectId') {
        return res.status(403).json({ error: 'Formato de rol incorrecto' });
      }
      return res.status(500).json({ error: 'Error de servidor' });
    }
  };
  
  export const getRolesByPermissions = async (req, res) => {
    try {
      const { permisos } = req.query;
      const roles = await Roles.find({ permisos: { $in: permisos } });
      return res.status(200).json({ roles });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error de servidor' });
    }
  };
  