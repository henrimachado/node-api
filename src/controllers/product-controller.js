'use srict'

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');

exports.get = async (req, res, next) => {
    try {
        let data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    };
};

exports.getBySlug = async (req, res, next) => {
    try {
        let data = await repository.getBySlug(req.params.slug)
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    };
};

exports.getById = async (req, res, next) => {
    try {
        let data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    };
};

exports.getByTag = async (req, res, next) => {
    try {
        const data = await repository.getByTag(req.params.tag);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    };
};



exports.post = async (req, res, next) => {


    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A descrição deve conter pelo menos 3 caracteres');

    //Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    //Instanciando o produto já com o que vier do corpo da requisição
    //Se for necessária a definição do que será inserido, é melhor fazer a requição atributo a atributo, ao invés de passar o corpo inteiro de uma vez

    /*
    Conferir se é possível fazer assim, ou se é preciso fazer individualmente (product.title = req.body.title)

    product = {
        title: req.body.title,
        slug = req.body.slug, 
        description = req.body.description,
        price = req.body.price,
        active = req.body.active, 
        tags = req.body.tags
    };
    
    */
    try {
        await repository.create(req.body);
        res.status(201).send({ message: 'Produto cadastrado com sucesso!' });
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    };

};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({ message: 'Produto atualizado com sucesso!' });
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    };
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({ message: 'Produto removido com sucesso!' });
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    };
};
