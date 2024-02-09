import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

mongoose.set("strictQuery",false)

const url = process.env.PHONEBOOK_URI;

mongoose.connect(url)
.then(result =>{
    if(result){
        console.log("Conectado a MongoDB")
    } else{

        console.log("Ocurrio un error")
    }
})

const contactSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Contact = new mongoose.model(`Contact`,contactSchema)

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id= returnedObject._id;
        delete returnedObject._id,
        delete returnedObject.__v
    }
})

export default Contact;