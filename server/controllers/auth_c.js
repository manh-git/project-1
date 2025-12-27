import pkg from 'express';
const { Request, Response } = pkg;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserbyEmail,createUser,updateReset, updatePassword,findUserByResetToken} from "../models/user.js";
import crypto from 'crypto'
import sendEmail from '../utils/email.js'


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN ='1d';
const JWT_COOKIE_EXPIRES_IN_MS = 1 * 24 * 60 * 60 * 1000;


const generateToken = (userId, email)=>{
    return jwt.sign({userId: userId, email:email},JWT_SECRET,{
        expiresIn: JWT_EXPIRES_IN,
    });
};
const checkPassword = (password)=>{
    const strong = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
        //dài it nhất 8 ký tự it nhất 1 chữ hoa it nhất 1 chữ thường 1 số và 1 ký wtuj đặc biệt
    );
    return strong.test(password);

};

export const signup = async(req, res) => {
    console.log("--- START SIGNUP HANDLER ---"); 
    console.log("Request Body:", req.body);
    const {username,email,password}=req.body;
    if(!username || !password || !email){
        return res.status(400).json({message: 'Please provide your username, email and password.'});
    }
    if(!checkPassword(password)){
        return res.status(400).json({
            message: 'Password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters.'
        });
    }
    
    try{
        const existingUser = await findUserbyEmail(email);
    if(existingUser){
        return res.status(409).json({message: 'The email already exists.'})
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = await createUser(username,email,hashedPassword);
    const token = generateToken(newUser.UserId, newUser.Email);
    res.status(201)
        .cookie('token',token,{
            httpOnly: true,
            //secure: process.env.NODE_ENV ==='production',
            secure:false,
            path: '/',
            sameSite: 'Lax',
            maxAge: JWT_COOKIE_EXPIRES_IN_MS
        })
        .json({
            status: 'success',
            username: newUser.UserName,
            message: 'Sign-Up successful.'
        });
    
}
     catch(error){
        console.error("Error Sign-Up", error);
        res.status(500).json({message: 'Internal server error during the registration process.'})
     }
}
export const login = async(req, res)=>{
    const {email, password} = req.body;
    if(!email|| !password){
        return res.status(400).json({message: 'Please provide your username and password.'});
    }
    try{
        const user = await findUserbyEmail(email);
        if(!user){
            return res.status(401).json({message: 'The username or password is invalid.'})
        }
        const isMatch = await bcrypt.compare(password,user.PasswordHash);
        if(!isMatch){
            return res.status(401).json({message: 'The username or password is invalid.'})
        }
        const token = generateToken(user.UserId, user.Email);
        res.status(200)
           .cookie('token',token,{
            httpOnly: true,
            //secure: process.env.NODE_ENV ==='production',
            secure:false,
            sameSite: 'Lax',
            path: '/',
            maxAge: JWT_COOKIE_EXPIRES_IN_MS
        })
           .json({
            status: 'success',
            userId: user.UserID,
            username: user.UserName,
            message: 'Login successful.'
        });
    }
    catch(error){
        console.error("Error Log-In", error);
        res.status(500).json({message: 'Internal server error during the registration process.'})
     }
}
export const logout =(req, res)=>{
    try{
    
        res.status(200)
           .cookie('token','',{
            httpOnly: true,
            //secure: process.env.NODE_ENV ==='production',
            secure: false,
          
            expires: new Date(Date.now() -1)
        })
           .json({
            status: 'success',
            message: 'Log-Out successful.'
        });
    }
    catch(error){
        console.log('Error', error);
        res.status(500).json({message:'Internal server error during the registration process.'});
    }
}
export const getMe = async(req, res) =>{
    if(!req.user){
        return res.status(401).json({
            status:'error',
            message:'User information not found in req.'
        });
    }
    try {
        const userDetails = await findUserbyEmail(req.user.email); 
        
        if (!userDetails) {
            return res.status(404).json({ status: 'error', message: 'User not found in database.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                userId: userDetails.UserID,
                email: userDetails.Email,
                username: userDetails.UserName 
            }
        });
    } catch (error) {
        console.error("Error fetching user details in getMe:", error);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
}
export const forgotP = async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({message: 'Please provide your email addres.'});
        
    }try{
            const user = await findUserbyEmail(email);
            if(!user){
                return res.status(200).json({status:'success',message:'If user exists, a password reset email has been sent.'});

            }
            const resetToken = crypto.randomBytes(32).toString('hex');
            const tokenExpires = new Date(Date.now()+3*60*1000);
            await updateReset(email,resetToken,tokenExpires);
            const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

            const message=`Forgot Your Password? Please click to link for reset: ${resetURL} `
            await sendEmail({
                email: user.Email,
                subject: 'Reset Password.',
                message: message
            })
            res.status(200).json({
                status:'success',
                message:'A password reset link has been sent to your email.'

            })
        }catch(e){
                console.error("Error in forgotPass:",e);
                if (user && user.Email) { 
                await updateReset(user.Email,null,null);
            }
                res.status(500).json({message:'Internal server error during passwword reset request.'});
            }
}

export const resetPassword = async(req,res)=>{
    const {token} = req.params;//lấy token từ url
    const {password,passwordConfirm}= req.body;
    if(!password||password!==passwordConfirm){
        return res.status(400).json({message:'Password and confirmation must match.'})

    } 
    try{
        const user = await findUserByResetToken(token);
        if(!user){
            return res.status(400).json({message:'Token is invalid or has expired.'})
        }
        if(!checkPassword(password)){
            return res.status(400).json({message:'Password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters.'})
        }
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword= await bcrypt.hash(password,salt);
        await updatePassword(user.UserID, newHashedPassword);
        const newToken = generateToken(user.UserID,user.Email);
        res.status(200).cookie('token',newToken,{
            httpOnly: true,
            //secure: process.env.NODE_ENV ==='production',
            secure:false,
            sameSite: 'Lax',
            path: '/',
            maxAge: JWT_COOKIE_EXPIRES_IN_MS
        }).json({status: 'success', message:'Password reset successfull.'})
    }catch(e){
        await updateReset(user.Email,null,null);
        console.error("Error in reset Pass:",e);
        res.status(500).json({message:'Internal server error during passwword reset request. '})
    }
}

export const updateMyPassword = async(req, res)=>{
    if (!req.user) { 
        return res.status(401).json({ message: 'Authentication required to change password.' });
    }
    const { currentPassword, password, passwordConfirm } = req.body;
    if (!currentPassword) {
        return res.status(400).json({ message: 'Please provide your current password.' });
 }
    if (password !== passwordConfirm) {
        return res.status(400).json({ message: 'New password and confirmation must match.' });
}
    if (!checkPassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters.' });
    }    

    try {
        const user = await findUserbyEmail(req.user.email); 
        if (!currentPassword) {
            return res.status(400).json({ message: 'Please provide your current password.' });
    }
        const isMatch = await bcrypt.compare(currentPassword, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'The current password is incorrect.' });
        }
        
        
        
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(password, salt);
        const rowsAffected =await updatePassword(user.UserID, newHashedPassword);

        res.status(200)
           .cookie('token', '', {
               httpOnly: true,
               secure: false, 
               sameSite: 'Lax',
               path: '/',
               maxAge: new Date(Date.now() -1000)
           })
           .json({ status: 'success', message: 'Password updated successfully. You have been logged out of all other sessions.' });
           
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: 'Internal server error during password update.' });
    }
};