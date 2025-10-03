const Sequelize = require("sequelize");
const config = require("../config/database").development;
const Customer = require("../App/models/Customer");
const Contact = require("../App/models/Contact");
const User = require("../App/models/User");

const models = [Customer, Contact, User];

class Database {
  constructor(){
    this.connection = new Sequelize(config);
    this.init();
    this.associate();
  }
  init(){
    models.forEach(model => model.init(this.connection));
  }
  associate(){
    models.forEach(model => {
      if(model.associate){
        model.associate(this.connection.models)
      }
    })
  }
}
module.exports = new Database();