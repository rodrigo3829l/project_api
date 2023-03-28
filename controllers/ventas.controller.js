import { Encargado } from "../models/EncaradoEntrega.js";
import { Paquetes } from "../models/Paquete.js";
import { User } from "../models/Users.js";
import { GetVentas, Ventas } from "../models/Ventas.js";
import {uploadImage, deleteImage} from '../utils/cloudinary.js'
import fs from 'fs-extra';

export const addVenta = async (req, res) => {
    const {idUsuario, paquetes} = req.body;
    try {
      console.log(idUsuario)
      console.log(paquetes)
        let fechaActualD = new Date();
        let dia = fechaActualD.getDate().toString().padStart(2, "0"); // Agrega un cero a la izquierda si el día tiene un solo dígito
        let mes = (fechaActualD.getMonth() + 1).toString().padStart(2, "0"); // Agrega un cero a la izquierda si el mes tiene un solo dígito
        let anio = fechaActualD.getFullYear().toString().slice(-2); // Toma los últimos dos dígitos del año

        let fechaFormateada = dia + "-" + mes + "-" + anio;

        let fechaActual = new Date();
        let hora = fechaActual.getHours().toString().padStart(2, "0"); // Agrega un cero a la izquierda si la hora tiene un solo dígito
        let minutos = fechaActual.getMinutes().toString().padStart(2, "0"); // Agrega un cero a la izquierda si los minutos tienen un solo dígito   

        let horaFormateada = hora + ":" + minutos;
        let totalPaqs = 0;
        let i;
        for ( i = 0 ;  i < paquetes.length; i++){
            const paquete = await Paquetes.findById(paquetes[i].idPaquete);
            if(!paquete) return res.status(400).json({error: "No existe el producto"});
            paquetes[i].total = paquete.precio * paquetes[i].cantidad
            if(paquete.existencia <  paquetes[i].cantidad) return res.status(400).json({error: `No se concreto la venta, paquete ${paquete.nombre} insuficiente, cantidad en stock: ${paquete.existencia}`});
            paquete.existencia =  (Number(paquete.existencia) - paquetes[i].cantidad).toString();
            if(paquete.existencia === "0") paquete.estado = "No disponible"
            totalPaqs = totalPaqs + Number(paquetes[i].total);
            await paquete.save();
          }     
             
        const user = await User.findById(idUsuario);
        if(!user) return res.status(400).json({error: "El usuario no existe"}); 
        const encargados = await Encargado.find({estado: "Disponible"})

        let numAleatorio = Math.floor(Math.random() * encargados.length); // Genera un número aleatorio entre 0 y 5
        console.log(numAleatorio); // Muestra el número aleatorio generado en la consola

        encargados[numAleatorio].paquetes = encargados[numAleatorio].paquetes - 1;
        if(encargados[numAleatorio].paquetes === 0){
          encargados[numAleatorio].estado = "No disponible"
        }
        const paq = paquetes;
        const venta = new Ventas({
          fecha : fechaFormateada,
          hora : horaFormateada,
          idUsuario, 
          paquetes : paq,
          total:totalPaqs,
          estado : 'No entregado',
          encargadoEntrega : encargados[numAleatorio]._id
        })
        const newVenta = await venta.save();
        await encargados[numAleatorio].save();
        return res.status(200).json({newVenta})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
    }
}

export const getVentaForId = async (req, res) =>{
    const {id} = req.params;
    try {
        const {
            fecha,
            hora,
            idUsuario,
            paquetes,
            total,
            encargadoEntrega,
            estado,
        } = await Ventas.findById(id);
        //console.log(idUsuario.toString())
        const user = await User.findById(idUsuario.toString());
        const userName = (user.name + " " + user.app + " " + user.apm);
        let getPaquetes = [];
        let i ;
        for ( i = 0; i < paquetes.length; i++){
            const paq = await Paquetes.findById(paquetes[i].idPaquete);
            // console.log(paq.nombre);
            const addPaq = {
                paquete: paq.nombre,
                cantidad : paquetes[i].cantidad,
                total: paquetes[i].total,
            }
            getPaquetes.push(addPaq);
        }
        const encargado = await Encargado.findById(encargadoEntrega.toString());
        const enca = await User.findById(encargado.idUsuario.toString());
        //console.log(encargadoEntrega)
        const getventa = new GetVentas ({
            fecha,
            hora,
            usuario : userName,
            paquetes : getPaquetes,
            total,
            encargadoEntrega : enca.name + " " + enca.apm + " " + enca.apm,
            _id : id,
            estado
        });
        return res.status(200).json(getventa);
    } catch (error) {
        console.log("error \n" + error)
        return res.status(500).json({error: 'Error en el servidor o la bd'})
    }
}

export const getVentaForDate = async (req, res) =>{
  const { fecha } = req.body;
  try {
      const ventas = await Ventas.find({ fecha });
      const getventas = [];
      for (let i = 0; i < ventas.length; i++) {
          const {
              fecha,
              hora,
              idUsuario,
              paquetes,
              total,
              encargadoEntrega,
              estado
          } = ventas[i];

          const user = await User.findById(idUsuario.toString());
          const userName = (user.name + " " + user.app + " " + user.apm);

          let getPaquetes = [];
          for (let j = 0; j < paquetes.length; j++) {
              const paq = await Paquetes.findById(paquetes[j].idPaquete);
              const addPaq = {
                  paquete: paq.nombre,
                  cantidad : paquetes[j].cantidad,
                  total: paquetes[j].total,
              }
              getPaquetes.push(addPaq);
          }

          const encargado = await Encargado.findById(encargadoEntrega.toString());
          const enca = await User.findById(encargado.idUsuario.toString());

          const getventa = new GetVentas ({
              fecha,
              hora,
              usuario : userName,
              paquetes : getPaquetes,
              total,
              encargadoEntrega: enca.name + " " + enca.app + " " + enca.apm,
              estado
          });
          getventas.push(getventa);
      }
      return res.status(200).json({ getventas });
  } catch (error) {
      console.log(error);
      return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
  }
}

export const getVentas = async (req, res) =>{
  try {
      const ventas = await Ventas.find();
      const getventas = [];
      for (let i = 0; i < ventas.length; i++) {
          const {
              fecha,
              hora,
              idUsuario,
              paquetes,
              total,
              encargadoEntrega,
              estado,
              _id
          } = ventas[i];

          const user = await User.findById(idUsuario.toString());
          const userName = (user.name + " " + user.app + " " + user.apm);

          let getPaquetes = [];
          for (let j = 0; j < paquetes.length; j++) {
              const paq = await Paquetes.findById(paquetes[j].idPaquete);
              const addPaq = {
                  paquete: paq.nombre,
                  cantidad : paquetes[j].cantidad,
                  total: paquetes[j].total,
              }
              getPaquetes.push(addPaq);
          }

          const encargado = await Encargado.findById(encargadoEntrega.toString());
          const enca = await User.findById(encargado.idUsuario.toString());

          const getventa = new GetVentas ({
              fecha,
              hora,
              usuario : userName,
              paquetes : getPaquetes,
              total,
              encargadoEntrega: enca.name + " " + enca.app + " " + enca.apm,
              estado,
              _id
          });
          getventas.push(getventa);
      }
      return res.status(200).json({ getventas });
  } catch (error) {
      console.log(error);
      return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
  }
}

export const getVentasEntreHoras = async (req, res) => {
    const { horaInicio, horaFin } = req.body;
    console.log(`Hora inicio: ${horaInicio}, hora fin: ${horaFin}`);
  
    try {
      const ventas = await Ventas.find({ hora: { $gte: horaInicio, $lte: horaFin } });
      const getVentas = [];
  
      for (const venta of ventas) {
        const user = await User.findById(venta.idUsuario.toString());
        const userName = user ? `${user.name} ${user.app} ${user.apm}` : '';
  
        const getPaquetes = await Promise.all(venta.paquetes.map(async (paquete) => {
          const { nombre } = await Paquetes.findById(paquete.idPaquete);
          return {
            paquete: nombre,
            cantidad: paquete.cantidad,
            total: paquete.total
          };
        }));
        //console.log()
        const enc = await Encargado.findById(venta.encargadoEntrega.toString());
        //console.log();
        const usuario = await User.findById(enc.idUsuario.toString());
        
  
        const getVenta = new GetVentas({
          fecha: venta.fecha,
          hora: venta.hora,
          usuario: userName,
          paquetes: getPaquetes,
          total: venta.total,
          _id: venta._id,
          estado: venta.estado,
          encargadoEntrega: usuario.name + " " + usuario.app + " " + usuario.apm,
        });
  
        getVentas.push(getVenta);
      }
  
      return res.status(200).json({ ventas: getVentas });
    } catch (error) {
      console.log(`Error: ${error}`);
      res.status(500).json({
        message: 'Error al buscar las ventas entre las horas indicadas'
      });
    }
  }
  
  export const getVentasPorFechaYHora = async (req, res) => {
    const { fecha, horaInicio, horaFin } = req.body;
    console.log(`Fecha: ${fecha}, hora inicio: ${horaInicio}, hora fin: ${horaFin}`);
    
    try {
      const ventas = await Ventas.find({
        fecha: fecha,
        hora: { $gte: horaInicio, $lte: horaFin }
      });
  
      const getVentas = [];
  
      for (const venta of ventas) {
        const user = await User.findById(venta.idUsuario.toString());
        const userName = user ? `${user.name} ${user.app} ${user.apm}` : '';
  
        const getPaquetes = await Promise.all(venta.paquetes.map(async (paquete) => {
          const { nombre } = await Paquetes.findById(paquete.idPaquete);
          return {
            paquete: nombre,
            cantidad: paquete.cantidad,
            total: paquete.total
          };
        }));

        //console.log()
        const enc = await Encargado.findById(venta.encargadoEntrega.toString());
        //console.log();
        const usuario = await User.findById(enc.idUsuario.toString());
  
        const getVenta = new GetVentas({
          fecha: venta.fecha,
          hora: venta.hora,
          usuario: userName,
          paquetes: getPaquetes,
          total: venta.total,
          _id: venta._id,
          estado: venta.estado,
          encargadoEntrega: usuario.name + " " + usuario.app + " " + usuario.apm,
        });
  
        getVentas.push(getVenta);
      }
  
      return res.status(200).json({ ventas: getVentas });
    } catch (error) {
      console.log(`Error: ${error}`);
      res.status(500).json({
        message: 'Error al buscar las ventas por fecha y hora'
      });
    }
  }
  export const updateStateForSale = async (req, res) => {
    const {id} = req.body;
    try {
      const venta = await Ventas.findById(id);
      const user = await Encargado.findById(venta.encargadoEntrega.toString())
      user.estado = "Disponible";
      user.paquetes = user.paquetes + 1;
      await user.save();
      venta.estado = "Entregado";
      await venta.save();
      return res.status(200).json({actVenta : venta, actUser: user})
    } catch (error) {
      console.log(error);
    }
  }
  export const getVentasByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const ventas = await Ventas.find({ idUsuario: id });
    const getVentas = [];

    for (const venta of ventas) {
      const user = await User.findById(venta.idUsuario.toString());
      const userName = user ? `${user.name} ${user.app} ${user.apm}` : '';

      const getPaquetes = await Promise.all(
        venta.paquetes.map(async (paquete) => {
          const { nombre } = await Paquetes.findById(paquete.idPaquete);
          return {
            paquete: nombre,
            cantidad: paquete.cantidad,
            total: paquete.total
          };
        })
      );

      const encargado = await Encargado.findById(
        venta.encargadoEntrega.toString()
      );
      const encargadoUsuario = await User.findById(
        encargado.idUsuario.toString()
      );
      const encargadoNombre = `${encargadoUsuario.name} ${
        encargadoUsuario.app
      } ${encargadoUsuario.apm}`;

      const getVenta = new GetVentas({
        fecha: venta.fecha,
        hora: venta.hora,
        usuario: userName,
        paquetes: getPaquetes,
        total: venta.total,
        _id: venta._id,
        estado: venta.estado,
        encargadoEntrega: encargadoNombre,
      });

      getVentas.push(getVenta);
    }

    return res.status(200).json({ ventas: getVentas });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Algo fallo en el servidor o la base de datos" });
  }
};


  