import express from 'express';

import morgan from 'morgan';
import cors from 'cors';
import Contact from './models/contact.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  next();
});

morgan.token('body', (request) => JSON.stringify(request.body));
const customLogFormat =
  ':method :url :status - :response-time ms - Content-Type: :req[Content-Type] - Request Body: :body';
app.use(morgan(customLogFormat));

app.get('/api/persons', (request, response, next) => {
  Contact.find({})
    .then((contact) => {
      response.json(contact);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;

  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;

  Contact.findByIdAndDelete(id)
    .then((contact) => {
      response.send(contact).status(204).end();
    })
    .catch((error) => next(error));
});

app.post(
  '/api/persons',
  (request, response, next) => {
    const { body } = request;

    // const checkName = () => persons.some(person => person.name === body.name);

    // if(!body.name || !body.number){

    //     response.status(404)

    //     return response.json({
    //         error: "No name or number, please try again"
    //     })
    // } else {

    const contact = new Contact({
      name: body.name,
      number: body.number,
    });

    contact
      .save()
      .then((res) => {
        console.log('Contacto guardado');
        response.json(res);
      })
      .catch((error) => next(error));
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
);

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  Contact.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((contactUpdated) => {
      res.json(contactUpdated);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response) => {
  const date = new Date();

  Contact.countDocuments({}).then((result) => {
    response.send(`
    <p>Phonebook has info for ${result} people<p>
    <p>${date}<p>
    `);
  });
});

// Error Middleware
// Cuando se realice una peticion a una ruta inexistente, llega a este error, ruta no definida en servidor

const routeError = (req, res) => {
  console.log('Middleware Error Handling');
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(routeError);

const idError = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(idError);

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log('Servidor activo localmente...');
});
