const Customer = require('../models/Customer');
const Contact = require('../models/Contact');
const {Op} = require('sequelize');
const { parseISO } = require('date-fns');
const Yup = require('yup');

class ContactsController{
 async index(req, res) {
    const {
      name,
      email,
      status,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.page || 25;

    let where = {};
    let order = [];

    if (name) {
      where = {
        ...where,
        name: {
          [Op.ILIKE]: name,
        },
      };
    };
    if (email) {
      where = {
        ...where,
        email: {
          [Op.ILIKE]: email,
        },
      };
    };
    if (status) {
      where = {
        ...where,
        status: {
          [Op.in]: status.split(',').map((item) => item.toUpperCase()),
        },
      };
    };
    if (createdBefore) {
      where = {
        ...where,
        createdAt: {
          [Op.gte]: parseISO(createdBefore),
        },
      };
    };
    if (createdAfter) {
      where = {
        ...where,
        createdAt: {
          [Op.lte]: parseISO(createdAfter),
        },
      };
    };
    if (updatedBefore) {
      where = {
        ...where,
        updatedAt: {
          [Op.gte]: parseISO(updatedBefore),
        },
      };
    };
    if (updatedAfter) {
      where = {
        ...where,
        updatedAt: {
          [Op.lte]: parseISO(updatedAfter),
        },
      };
    };
    if (sort) {
      order = sort.split(',').map((item) => item.splice(':'));
    };

    const data = await Customer.findAll({
      where,
      include: [
        {
          model: Contact,
          attributes: ['id', 'status'],
        },
      ],
      order,
      limit,
      offset: limit * page - limit,
    });

    return res.json(data);
  };
  
  
  async show(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      attributes: { exclude: ['customer_id', 'customerId'] },
    });
    if (!contact) {
      return res.status(404);
    }
    return res.json(contact);
  }

  async create(req, res){
    const schema = Yup.object.shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      status: Yup.string().uppercase(),
    });
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Error on validate schema'});
    }
    const contact = await Contact.create({
      customer_id: req.params.customerId,
      ...req.body,
      attributes: {exclude: ['customer_id', 'customerId']},
    });
    return res.status(201).json(contact)
  }

  async update(req, res){
    const schema = Yup.object.shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      status: Yup.string().uppercase(),
    });
     if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Error on validate schema'});
    }
     const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      attributes: { exclude: ['customer_id', 'customerId'] },
    });
    if (!contact) {
      return res.status(404);
    }
    await contact.update(req.body);
    return res.json(contact)
  }

  async destroy(req, res){
    const contact = await Contact.findOne({
      where:{
        customer_id: req.params.customerId,
        id: req.params.id,
      },
    });
    if(!contact){
      return res.status(404);
    }
    await contact.destroy();
    return res.json();
  }
}

module.exports = new ContactsController();