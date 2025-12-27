import 'dotenv/config';

import express from 'express'
import cors from 'cors';
import mssql from 'mssql';
import cookieParser from 'cookie-parser';
import authrouter from './Route/auth_routes.js';
import flashcardRouter from './Route/flashcard_routes.js';
import quizRouter from './Route/quiz_routes.js';
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

mssql.connect(dbConfig)
    .then(pool=>{
        console.log('Success!');
        global.sqlPool = pool;
    })
    .catch(err=>{
        console.log('Error!',err);
        process.exit(1);
    });

const api=express();
/*api.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});*/
api.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
}));

api.use((req, res, next) => {
    console.log(`[Middleware Check] Method: ${req.method} URL: ${req.url}`);
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200); 
    } else {
        next();
    }
});
api.use(cookieParser());
api.use(express.json());
api.set('etag', false);
api.use('/api/auth',authrouter);
api.use('/api', flashcardRouter);
api.use('/api/quiz',quizRouter);
const PORT = process.env.PORT || 3000;
api.listen(PORT, () => {
    console.log(`Server is running and listening on port ${PORT}`);
});
console.log("Current JWT Secret:", process.env.JWT_SECRET);