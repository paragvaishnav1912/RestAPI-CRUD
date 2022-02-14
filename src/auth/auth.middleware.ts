import  Jwt  from "jsonwebtoken";
import {Request,Response, NextFunction } from 'express';
import coverage from "../common/coverage";
import { httpStatus } from "../common/coverage";
class authMiddleware{
    async jwtTokenValidate(req:Request,res:Response,next:NextFunction){
        try{
            const token = req.headers?.cookie?.substring(4);
            const decoded = Jwt.verify(token+"",`${process.env.JWT_KEY}`);
            next();
        }
        catch(e){
            return res.status(401).json({
                message: coverage.LOGIN_FIRST,
                status:"Authentication Failed",
                statusCode:httpStatus.AUTH_FAIL
            });
        }
    }
}

export default new authMiddleware();