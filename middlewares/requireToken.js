import jwt from 'jsonwebtoken'
import { TokenVerificationErrors } from '../utils/tokenManager.js';

export const requireToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization ;
        if(!token) 
            throw new Error('No Bearer');

        token = token.split(" ")[1];

        const {uid} = jwt.verify(token, process.env.JWT_SECRET)
        console.log("uid de require token => " + uid)
        req.uid = uid;

        next();
    } catch (error) {
        console.log(error.message);
        return res
        .status(401)
        .send({error: TokenVerificationErrors[error.message ]})
    }
};

// export const errorsValidateToken = (error) => {
//     switch (error){
//         case "invalid signature":
//             return "Firma no valida";
//         case "jwt expired":
//             return "Token expirado";
//         case "invalid token":
//             return  "Token invalido";
//         default:
//             return error;
//     }
// }