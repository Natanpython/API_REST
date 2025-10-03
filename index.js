const express = require("express");
const server = express();

server.use(express.json());

let customers = [
  {id: 1, nome: "DevSamurai", site: "http://devsamurai.com.br"},
  {id: 2, nome: "Google", site: "http://google.com"},
  {id: 3, nome: "UOL", site: "http://uol.com.br" }
];

server.get('/customers', (req, res)=>{
  return res.json(customers);
});

server.get('/customers/:id', (req, res)=>{
  const id = parseInt(req.params.id);
  const customer = customers.find(item => item.id === id);
  const status = customer ? 200 : 404;

  return res.status(status).json(customer);
});

server.post('/customers',(req, res) => {
  const {nome, site} = req.body;
  const id = customers[customers.length - 1].id + 1;
  const newCustomer = {id, nome, site};
  customers.push(newCustomer);

  return res.status(201).json(newCustomer);
});

server.put('/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const {nome, site} = req.body
  const index = customers.findIndex(item => item.id === id)
  const status = index >= 0 ? 200 : 404;
  if(index >= 0){
    customers[index] = {id: parseInt(id), nome, site }
  };

  return res.status(status).json(customers[index]);
});

server.delete('/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = customers.findIndex(item => item.id === id)
  const status = index >= 0 ? 200 : 404
  if(index >= 0){
    customers.splice(index, 1)
  };

  return res.status(status).json()
})
server.listen(3000, () => {
  console.log("Servido rodando http://localhost:3000/");
  
})