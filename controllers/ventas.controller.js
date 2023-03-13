import { Paquetes } from "../models/Paquete.js";
import { User } from "../models/Users.js";
import { GetVentas, Ventas } from "../models/Ventas.js";

export const addVenta = async (req, res) => {
    const {idUsuario, paquetes} = req.body;
    try {
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
            paquetes[i].total = paquete.precio * paquetes[i].cantidad
            if(paquete.existencia <  paquetes[i].cantidad) return res.status(400).json({error: `No se concreto la venta, paquete ${paquete.nombre} insuficiente, cantidad en stock: ${paquete.existencia}`});
            paquete.existencia =  (Number(paquete.existencia) - paquetes[i].cantidad).toString();
            if(paquete.existencia === "0") paquete.estado = "No disponible"
            totalPaqs = totalPaqs + Number(paquetes[i].total);
            await paquete.save();
          }          
        const paq = paquetes
        const venta = new Ventas({
            fecha : fechaFormateada,
            hora : horaFormateada,
            idUsuario, 
            paquetes : paq,
            total:totalPaqs,
        })
        const newVenta = await venta.save();
        return res.status(200).json({newVenta})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Algo fallo en el servidor o la base de datos'})
    }
}

export const getVentaForId = async (req, res) =>{
    const {id} = req.params;
    console.log(id)
    try {
        const {
            fecha,
            hora,
            idUsuario,
            paquetes,
            total
        } = await Ventas.findById(id);
        //console.log(idUsuario.toString())
        const user = await User.findById(idUsuario.toString());
        const userName = (user.name + " " + user.app + " " + user.apm);
        let getPaquetes = [];
        let i ;
        for ( i = 0; i < paquetes.length; i++){
            const paq = await Paquetes.findById(paquetes[i].idPaquete);
            console.log(paq.nombre);
            const addPaq = {
                paquete: paq.nombre,
                cantidad : paquetes[0].cantidad,
                total: paquetes[0].total,
            }
            getPaquetes.push(addPaq);
        }
        const getventa = new GetVentas ({
            fecha,
            hora,
            usuario : userName,
            paquetes : getPaquetes,
            total,
            _id : id,
        });
        console.log(getventa)
    } catch (error) {
        console.log("error \n" + error)
    }
}

export const getVentaForDate = async (req, res) =>{
    const {fechaParam} = req.params;
    console.log(fechaParam);

    try {
        const {
            fecha,
            hora,
            idUsuario,
            paquetes,
            total
        } = await Ventas.findOne({ fechaParam });

        const user = await User.findById(idUsuario.toString());
        const userName = (user.name + " " + user.app + " " + user.apm);
        let getPaquetes = [];
        let i ;
        for ( i = 0; i < paquetes.length; i++){
            const paq = await Paquetes.findById(paquetes[i].idPaquete);
            console.log(paq.nombre);
            const addPaq = {
                paquete: paq.nombre,
                cantidad : paquetes[0].cantidad,
                total: paquetes[0].total,
            }
            getPaquetes.push(addPaq);
        }
        const getventa = new GetVentas ({
            fecha,
            hora,
            usuario : userName,
            paquetes : getPaquetes,
            total,
        });
        return  res.status(200).json({getventa})
    } catch (error) {
        console.log("error \n" + error)
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
  
        const getVenta = new GetVentas({
          fecha: venta.fecha,
          hora: venta.hora,
          usuario: userName,
          paquetes: getPaquetes,
          total: venta.total,
          _id: venta._id
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
  
        const getVenta = new GetVentas({
          fecha: venta.fecha,
          hora: venta.hora,
          usuario: userName,
          paquetes: getPaquetes,
          total: venta.total,
          _id: venta._id
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
  