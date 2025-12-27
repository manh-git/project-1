import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { findUserbyEmail } from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET ;

export const protect = async(req, res, next)=>{
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    let token;
    if(req.cookies && req.cookies.token){
        token=req.cookies.token;
    }
    else if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token= req.headers.authorization.split(' ')[1];
    }
    
    
    if (!token){
        return res.status(401).json({
            message: 'Access denied. You are not logged in.',
            status: 'error'
        });
    }

    
try{
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
    const userDetails = await findUserbyEmail(decoded.email);
    if(!userDetails){
        console.error("User not found in DB for email: ", decoded.email);
        return res.status(401).json({status: 'error',message:'User belongin to this token no longer exists in DB.'});
    }
    req.validatedUser = userDetails;
    req.user = decoded;
    next();
} catch(err){

    return res.status(403).json({
        message: 'Invalid or expired token.',
        status: 'error'
    })
}}
