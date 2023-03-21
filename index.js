import 'dotenv/config'
import "./database/conectdb.js"
import express  from "express";
import authRouter from './routes/auth.route.js'
import questionRouter from './routes/question.route.js'
import cookieParser from 'cookie-parser';
import linkRouter from './routes/link.route.js'
import redirecRouter from './routes/redirect.router.js'
import aromaRouter from './routes/aroma.route.js'
import rolesRouter from './routes/roles.route.js'
import productosRouter from './routes/productos.route.js'
import paquetesRouter from './routes/paquetes.route.js'
import encargadoRouter from './routes/encargado.route.js'
import ventasRouter from './routes/ventas.route.js'
import cors from 'cors'

const app = express();

console.log("Hola bd => " , process.env.URI_MONGO);

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2]

app.use(
    cors({
        origin: function (origin, callback){
            //console.log("HOla origin => ", origin)
            if(!origin || whiteList.includes(origin)){
                return callback(null, origin);
            }
            return callback("Error de corse origin: " + origin + " no autorizado")
        },
        credentials: true,
}))

app.use(express.json());
app.use(cookieParser())

//ejemplo backend redirecionamiento (Opcional)
app.use('/', redirecRouter);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/Links', linkRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/aroma', aromaRouter)
app.use('/api/v1/roles', rolesRouter)
app.use('/api/v1/productos', productosRouter);
app.use('/api/v1/paquetes', paquetesRouter);
app.use('/api/v1/encargados', encargadoRouter);
app.use('/api/v1/ventas', ventasRouter)


//app.use(express.static('public'))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('hola servidor http://localhost:' + PORT));