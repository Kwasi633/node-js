const express = require('express');
const bodyParser = require('body-parser');
const mongoPratcice = require('./mongo')

const app = express();

app.use(bodyParser.json());

app.post('/products', mongoPratcice.createProduct);

app.get('/products');

app.listen(3000);