const MongoClient = require('mongodb').MongoClient

const url = `mongodb+srv://ezra:9VmVCS2tDMzk7TuZ@cluster0.4epjd.mongodb.net/products_test?retryWrites=true&w=majority&appName=Cluster0`

const createProduct = async (req, res, next) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price
    }
    const client = new MongoClient(url)

    try{
        await client.connect();
        const db = client.db()
        const result = db.collection('products').insertOne(newProduct)
    }catch(error){
        return res.json({ message: 'Could not store data'})
    }
    client.close()

    res.json(newProduct)
}

const getProducts = async (req, res, next) => {

}

exports.createProduct = createProduct;
exports.getProducts = getProducts

pass=''