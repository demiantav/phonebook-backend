import  express  from "express";
import morgan from "morgan";
import cors from 'cors';
import Contact from "./models/contact.js";


let customLogFormat;
const app = express();


const PORT = process.env.PORT;

app.listen(PORT, () =>{

    console.log("Servidor activo localmente...")
})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'));

app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  next();
});

morgan.token('body', (request) => JSON.stringify(request.body))
customLogFormat = `:method :url :status - :response-time ms - Content-Type: :req[Content-Type] - Request Body: :body`;
app.use(morgan(customLogFormat))



let persons= [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Demian Tavolaro",
        "number": "6745456",
        "id": 3
      },
      {
        "name": "elvira",
        "number": "12312312",
        "id": 8
      },
      {
        "name": "rafael",
        "number": "4545",
        "id": 9
      },
      {
        "name": "josefina",
        "number": "444",
        "id": 11
      },
      {
        "name": "carlos",
        "number": "5",
        "id": 12
      },
      {
        "name": "fabi",
        "number": "5555",
        "id": 13
      },
      {
        "name": "jorge",
        "number": "323232",
        "id": 14
      },
      {
        "name": "julio",
        "number": "21",
        "id": 16
      },
      {
        "name": "juancho",
        "number": "23490984",
        "id": 17
      }
]

app.get("/api/persons", (request, response) => {

  Contact.find({}).then(contact =>{
    response.json(contact)
  })


})

app.get("/api/persons/:id", (request,response) => {

    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if(person){

        response.json(person)
    }else{

        response.status(404).end();
    }
})

app.delete("/api/persons/:id", (request,response) => {

    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end()
})

app.post("/api/persons", (request,response) => {

    const body = request.body;

    // const checkName = () => persons.some(person => person.name === body.name);

    if(!body.name || !body.number){

        response.status(404)

        return response.json({
            error: "No name or number, please try again"
        })
    } else {

      const contact = new Contact({
        name: body.name,
        number: body.number,
      })

      contact.save().then(contact =>{
        console.log("Contacto guardado")
        response.json(contact)
      })
    }


    
    // if(checkName()){

    //     response.status(409);
        
    //     return response.json({
    //         error: "Name must be unique"
    //     })
    // } else {

    //     const person = {
    //         name: body.name,
    //         number:body.number,
    //         id: generateID()

    //     }

    //     persons = persons.concat(person)

    //     response.json(person);

        console.log("post")
    
    

    

    
})

app.get("/info", (request, response) => {

const date = new Date();

    response.send(`
       <p>Phonebook has info for ${persons.length} people<p>
       
       <p>${date}<p>
    
    `)


})

const generateID = () => Math.floor(Math.random() * 3000)