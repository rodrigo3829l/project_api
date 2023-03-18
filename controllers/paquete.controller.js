import { GetPaquetes, Paquetes } from "../models/Paquete.js";
import { Productos } from "../models/Productos.js";

export const addPaquetes = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            precio,
            img,
            productos,
            existencia,
            estado,
        } = req.body;

        const productosId = productos.map(item => item.id_producto);
        let i;
        for (i = 0; i < productosId.length; i++){
            const producto = await Productos.findById(productosId[i]);
            const exis = Number( producto.existencia);
            if(exis < existencia)  return res.status(401).json({error:'No hay suficientes productos para agregar esta ccantidad de paquetes: Productos => ' + exis})
            producto.existencia = exis - existencia;
            await producto.save();
        }
        
        let addPaquete = await Paquetes.findOne({nombre});
        if(addPaquete) throw {code: 11000};
    
        addPaquete = new Paquetes ({
            nombre,
            descripcion,
            precio,
            img,
            productos : productosId,
            existencia,
            estado
        });
          
        const newPaquete = await addPaquete.save();
        console.log(newPaquete)
        return res.status(201).json({newPaquete});
    } catch (error) {
        console.log(error)
        if(error.code === 11000){
            return res.status(400).json({error: 'Ya existe el paquete'})
        }
        return res.status(500).json({error: 'Algo ha fallo en el servidor o la base de datos'}) 
    }
}
export const addNumberPaquetes = async (req, res) =>{
    const {id, numero} = req.body;
    try {
        const paquete = await Paquetes.findById(id);
        const {productos} = paquete;
        //console.log(productos[0].toString())
        let i;
        for (i = 0; i < productos.length; i++){
            const producto = await Productos.findById(productos[i].toString());

            const exis = Number( producto.existencia);
            if( exis < numero ) return res.status(400).json({error : 'No hay suficientes productos para el paquete'})
            producto.existencia = exis - numero;
            await producto.save();
        }
        const tot =Number(paquete.existencia) + numero;
        console.log(tot.toString())
        paquete.existencia = tot.toString();
        paquete.estado = "Disponible";
        await paquete.save();
        return res.status(200).json({paquete})
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: "Error de servidor"})
    }
}
export const getPaquetes = async (req, res) => {
    try {
        const paquetes = await Paquetes.find();
        let i;
        let getPaquetes= [];
        for ( i = 0; i < paquetes.length; i++){
            const {
                nombre,
                descripcion,
                precio,
                img,
                productos,
                existencia,
                estado,
            } = await Paquetes.findById(paquetes[i].id);
            let getProductos = [];
            let j;
            for ( j = 0; j < productos.length ;j++){
                //console.log(productos[i].toString())
                const product = await Productos.findById(productos[j].toString());
                getProductos.push(product.nombre);
            }
            const getPaquete = new GetPaquetes({
                nombre,
                descripcion,
                precio, 
                img,
                productos : getProductos,
                existencia,
                estado,
            })
            getPaquetes.push(getPaquete);
        }
        return res.status(201).json({getPaquetes});
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'Error de servidor'})
    }
}

export const getPaquete = async (req, res) => {
    try {
        const {id} = req.params;
        const {
            nombre,
            descripcion,
            precio, 
            img,
            productos,
            existencia,
            estado,
        } = await Paquetes.findById(id);
        let getProductos = [];
        let i
        for ( i = 0; i < productos.length ;i++){
            //console.log(productos[i].toString())
            const product = await Productos.findById(productos[i].toString());
            getProductos.push(product.nombre);
        }
        console.log(getProductos);
        const getPaquete = new GetPaquetes({
            nombre,
            descripcion,
            precio,
            img,
            productos : getProductos,
            existencia,
            estado,
        })
        return res.status(201).json({getPaquete});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'Error de servidor'})
    }
}
export const updatePaquete = async (req, res) =>{
    try {
        const {id} = req.params;
        const {
            nombre,
            descripcion,
            precio,
            img,
            productos,
            existencia,
            estado,
        } = req.body;
        
        const uppPaq = await Paquetes.findById(id);
        console.log(uppPaq)
        if(!uppPaq) throw new Error ("No existe el paquete");
        const productoIds = productos.map(producto => producto.id_producto);

        uppPaq.nombre = nombre;
        uppPaq.descripcion = descripcion;
        uppPaq.precio = precio;
        uppPaq.img = img;
        uppPaq.productos = productoIds;
        uppPaq.existencia = existencia;
        uppPaq.estado = estado;
        await uppPaq.save();
        return res.json({uppPaq})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Error de servidor'})
    }
}