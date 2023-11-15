'use strict'

const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async (data) => {
    const res  = await Order.find({}, 'number status')
    .populate('customer', 'name')
    .populate('items.product', 'title'); //populate preenche com as informações associadas da chave estrangeira
    return res;
};

exports.create = async (data) => {
    
    let order = new Order(data);
    await order.save();
    //salva os dados no banco de dados, tomar cuidado com a função assíncrona
};