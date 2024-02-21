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
    name: {
        type: String,
        minLength: 3,
        required: true

    },
    number: {
        type: String,
        validate: {
            validator: function(v){
                return /\b\d{2,3}-\d{6,}\b/.test(v);
            },
            message: props => `${props} is not a valid phone number!`
        },
        required: [true,'User number is required']
    }
});

const Contact = new mongoose.model(`Contact`,contactSchema)

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id= returnedObject._id;
        delete returnedObject._id,
        delete returnedObject.__v
    }
})

export default Contact;