import  Jwt  from "jsonwebtoken";
import {Request,Response, NextFunction } from 'express';

class authMiddleware{
    async jwtTokenValidate(req:Request,res:Response,next:NextFunction){
        try{
            const token = req.headers.authorization?.split(" ")[1];
            const decoded = Jwt.verify(token+"",`${process.env.JWT_KEY}`);
            //once user verified you can delete the token generated for email 
            next();
        }
        catch(e){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
    }
}

export default new authMiddleware();