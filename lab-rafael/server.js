'use strict';

const http = require('http');
const bodyParser = require('./lib/bodyparser');
const Router = require('./lib/router');
const storage = require('./lib/storage');

const router = new Router();

router.get('/api/v1/cars', (req, res) => {
  let cars = storage.readAll();
  let response = cars;
  console.log(cars);
  if ('id' in req.url.query) {
    let id = req.url.query.id;
    console.log('car id', cars[id]);
    cars.forEach(car => {
      if (car.id === id) {
        response = car;
        return;
      }
    });
    console.log(`404 car not found id: ${id}`);
  }
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(response));
  res.end();
});

router.post('/api/v1/cars', (req, res) => {
  bodyParser(req, res)
    .then(body => {
      let make = body.make;
      let model = body.model;
      let year = body.year;

      storage.create(model, make, year);
      console.log(body);
      console.log(storage.readAll());
      res.end();
    });
});

router.destroy('api/v1/cars', (req, res) => {
  let cars = storage.readAll();
  console.log(cars);
  if ('id' in req.url.query) {
    let id = req.url.query.id;
    console.log('car id', cars[id]);
    cars.forEach((car, index) => {
      if (car.id === id) {
        storage.splice(index, 1);
        console.log(cars);
        res.writeHead(204, {'Content-Type': 'application/json'});
        res.end();
      }
    });
  }
});

const server = http.createServer((req, res) => {
  router.tryRoute(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  storage.seed();
  console.log(`Your are now listening on port http://localhost:${PORT}`);
});
