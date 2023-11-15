'use srict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-controller');
const authService = require('../services/auth-service');



router.get('/', controller.get);
router.get('/:slug', controller.getBySlug);
router.get('/admin/:id', controller.getById);
router.get('/tags/:tag', controller.getByTag);


//Somente usuários com autorização podem cadastrar produtos. Para isso, precisam enviar o token
/*
url: http://localhost:3000/products?token=MEUTOKEN
headers: x-acesst-token | MEUTOKEN
corpo: "token":"MEUTOKEN"
*/
router.post('/', authService.isAdmin, controller.post);


router.put('/:id', authService.isAdmin, controller.put);

router.delete('/', authService.isAdmin, controller.delete);

module.exports = router;