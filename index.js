const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.wjypdwg.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const itemsCollection = client.db('store').collection('items');

        await client.connect()
        console.log('connected')

        app.post('/items', async (req, res) => {

            const item = req.body;
            const result = itemsCollection.insertOne(item);
            res.send(result)

        })

        app.get('/items', async (req, res) => {

            const items = await itemsCollection.find({}).toArray()
            res.send(items)

        })


        app.get('/singleItem/:id', async (req, res) => {
            const id = req.params.id;
            const item = await itemsCollection.findOne({ _id: ObjectId(id) });
            res.send(item)

        })



        app.put('/updateItemsQuantity/:id', async (req, res) => {
            const id = req.params.id;
            const updatedObject = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    name: updatedObject.name,
                    price: updatedObject.price,
                    img: updatedObject.img,
                    quantity: updatedObject.quantity,
                    description: updatedObject.description

                }
            }

            const result = await itemsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })




    } finally {

    }

}


run().catch(console.dir)

app.get('/', async (req, res) => {
    res.send('This is first commit')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
