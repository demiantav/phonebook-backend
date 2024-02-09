import mongoose from "mongoose";

const password = process.argv[2],
      name= process.argv[3],
      number= process.argv[4]

const URL = `mongodb+srv://demiantavolaro6:${password}@cluster0.jx8xzrh.mongodb.net/phonebookDB?retryWrites=true&w=majority`

mongoose.set(`strictQuery`,false);
mongoose.connect(URL);

if(password.length < 3){

    console.log('give password as argument')
    process.exit(1)


}

const contactSchema= new mongoose.Schema({
    name: String,
    number: Number

})

const Contact = new mongoose.model(`Contact`, contactSchema);

const contact = new Contact({
    name,
    number,

})

// contact.save()
//  .then(result => {

//     const [name, number] = result;

//     console.log(`Added ${result.name} ${result.number} to the phonebook`);
//     mongoose.connection.close();
//  })

 Contact.find({}).then(result => {

    console.log("Phonebook:")
    result.forEach(contact => {
        console.log(`${contact.name} ${contact.number}`);
    })

    mongoose.connection.close();
 })