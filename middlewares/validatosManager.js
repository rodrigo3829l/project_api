import axios from "axios";
import { validationResult, body, param} from "express-validator";

export const validationResultExpress  = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export const paramLinkValidator = [
    param("id", "Formato no valido (express-validator)")
    .trim()
    .notEmpty()
    .escape(),
    validationResultExpress
]

export const bodyLinkValidator = [
    body("longLink", "Formato del link incorrecto")
    .trim()
    .notEmpty()
    .custom(async value => {
        try {

            if(!value.startsWith('https://')){
                value = 'https://' + value;
            }

            await axios.get(value);
            return value;
        } catch (error) {
            //console.log(error);
            throw new Error ("Not found longLink 404")
        }
    })
    ,validationResultExpress
]

export const bodyRegisterValidator = [ 
    body('email', 'formato de email incorrecto')
    .trim()
    .isEmail()
    .normalizeEmail(),
    body('password', 'formato de la contraseña incorrecta')
    .trim()
    .isLength({min: 10}),
    validationResultExpress
]
export const bodyUpdateValidator = [
    body('name', " el nombre No cumple con los caracteres minimos (3)")
    .trim()
    .isLength({min: 3}),
    body('app', "el apellido paterno No cumple con los caracteres minimos (3)")
    .isLength({min: 3}),
    body('apm', "el apellido materno No cumple con los caracteres minimos (3)")
    .isLength({min: 3}),
    body('numCasa', " el numero de casa No cumple con los caracteres minimos (3)")
    .trim()
    .isLength({min: 3}),
    body('userName', " el nombre de usuarui No cumple con las especificaciones")
    .trim()
    .isLength({min: 3})
    .notEmpty(),
    body('userName', " La contraseña No cumple con las especificaciones")
    .trim()
    .isLength({min: 3})
    .notEmpty(),
    body('email', 'formato de email incorrecto')
    .trim()
    .isEmail()
    .normalizeEmail(),
    validationResultExpress
]

export const bodyLoginVlidator = [ 
    body('userName', 'formato de email incorrecto')
    .trim()
    .isLength({min: 10}),
    body('password', 'formato de la contraseña incorrecta')
    .trim(),
    validationResultExpress
]

export const bodyPreguntaValidator = [
    body('pregunta', 'Formato de la pregunta incorrecta')
    .trim(),
    validationResultExpress
]
export const bodyAromaValidator = [
    body('aroma', 'Formato del aroma')
    .trim()
    .isLength({min: 3 }),
    validationResultExpress
]
