'use strict'

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async() => {

    const res = await Product.find({
        active: true
    }, 'title price slug');

    return res;
};


exports.getBySlug = async(slug) => {
    const res = await Product
        .findOne({ //Só existe um, então por isso findOne para retornar um objeto simples
            slug: slug, //Capturando pelo slug que é recebido no parâmetro da url de requisição
            active: true
        }, 'title description price slug tags'); //buscando tudo que está ativo, mas recuperando somente alguns campos
    return res;
}; 

exports.getById = async(id) => {
    const res = await Product.findById(id);
    return res;
};

exports.getByTag = async(tag) => {
    const res = await Product
    .find({
        tags: tag, //devido ao mongoose, já olha diretamente para o array de tags e faz uma busca lá, sem precisar declarar um forEach
        active: true
    }, 'title description price slug tags');

    return res;
};

exports.create = async(data) => {
    let product = new Product(data);
    //salva os dados no banco de dados, tomar cuidado com a função assíncrona
    await product.save();
};

exports.update = async(id, data) => {
    await Product
    .findByIdAndUpdate(id, {
        $set: {
            title: data.title,
            description: data.description,
            price: data.price,
            slug: data.slug
        }
    });
};

exports.delete = async(id) => {
    await Product.findOneAndRemove(id);
};