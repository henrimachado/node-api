'use srict'

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');

exports.post = async (req, res, next) => {


    const contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 3, 'O email deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.password, 3, 'A senha deve conter pelo menos 3 caracteres');

    //Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY), //criptografa a senha com md5 e adiciona a chave privada que somente o servidor possui
            roles: ['user']
        });
        res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    };

};


exports.authenticate = async (req, res, next) => {

    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY) //criptografa a senha com md5 e adiciona a chave privada que somente o servidor possui
        });


        if (!customer) {
            res.status(404).send({ message: "Usuário ou senha inválidos" });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                id: customer.id,
                email: customer.email,
                name: customer.name,
            }
        });
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    };

};

exports.refreshToken = async (req, res, next) => {

    try {

        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const customer = await authService.decodeToken(token);


        if (!customer) {
            res.status(401).send({ message: "Cliente não encontrado." });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: tokenData,
            data: {
                id: customer.id,
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            }
        });
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    };

};
