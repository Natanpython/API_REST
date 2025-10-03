const { Router } = require('express');
const routes = new Router();

const customers = require('./App/Controllers/CustomersController');
const Contact = require('./App/Controllers/ContactsController');


//Customers
routes.get('/customers', customers.index);
routes.get('/customers/:id', customers.show);
routes.post('/customers', customers.create);
routes.put('/customers/:id', customers.update);
routes.delete('/customers/:id', customers.destroy);


//Contacts
routes.get('/customers/:customerId/contacts', Contact.index);
routes.get('/customers/:customerId/contacts/:id', Contact.show);
routes.post('/customers/:customerId/contacts', Contact.create);
routes.put('/customers/:customerId/contacts/:id', Contact.update);
routes.delete('/customers/:customerId/contacts/:id', Contact.destroy);

module.exports = routes;
