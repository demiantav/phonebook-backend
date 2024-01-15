import  express  from "express";

const app = express();

const PORT = 3001;

app.listen(PORT, () =>{

    console.log("Servidor activo localmente...")
})

app.use(express.json())

let persons= [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": 5,
        "name": "Poppendieck", 
        "number": "39-23"
      }
]

app.get("/api/persons", (request, response) => {


    response.json(persons)


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

    const checkName = () => persons.some(person => person.name === body.name);

    if(!body.name || !body.number){

        response.status(404)

        return response.json({
            error: "No name or number, please try again"
        })
    }
    
    if(checkName()){

        response.status(409);
        
        return response.json({
            error: "name must be unique"
        })
    } else {

        const person = {
            name: body.name,
            number:body.number,
            id: generateID()

        }

        persons = persons.concat(person)

        response.json(person);
    }
    

    

    
})

app.get("/info", (request, response) => {

const date = new Date();

    response.send(`
       <p>Phonebook has info for ${persons.length} people<p>
       
       <p>${date}<p>
    
    `)


})

const generateID = () => Math.floor(Math.random() * 3000)