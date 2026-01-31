import express from 'express';
import mongoose from "mongoose";
import charactersRouter from './routes/Characters.js';


try {
    const app = express();
    await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`, {
        serverSelectionTimeoutMS:3000
    });

    // middleware to support application/json Content-Type

    app.use(express.json());

    // middleware to support appplication/x-www-form-urlencoded
    app.use(express.urlencoded({extended:true}));


    app.use((req, res, next) => {
        // block non Accept: application/json request
        res.setHeader("Access-Control-Allow-Origin", "*");

        if(req.header('Accept') !== 'application/json' && req.method !== "OPTIONS"){
            res.setHeader("Allow", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
            res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type, Authorization, X-Requested-With");

            res.status(406);
            res.json({error: 'only JSON allowed as accept header'});
            return;
        }
        next();

    });

    app.get('/', (req, res) => {
        res.json({message: "welkom bij mijn webservice"})
    });

    app.use('/characters', charactersRouter);

    app.listen(process.env.EXPRESS_PORT, () => {
        console.log(`server werkt op poort ${process.env.EXPRESS_PORT}`)
    })
} catch (e) {
    console.log(e);
}

