'use strict'

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.create = async (data) => {
    const customer = new Customer(data);
    //salva os dados no banco de dados, tomar cuidado com a função assíncrona
    await customer.save();
};

exports.authenticate = async(data) => {
    const res = await Customer.findOne({
        email: data.email,
        password: data.password
    });

    return res;
};
exports.getById = async(data) => {
    const res = await Customer.findById(id);
    return res;
};