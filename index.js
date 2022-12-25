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
        
           app.post('/jwt', (req, res) =>{
            const user = req.body;
            const token = jwt.sign(user, process.env.TOKEN, { expiresIn: '1d'})
            res.send({token})
        })  


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

        app.get('/myItems/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        })


        app.put('/updateItemsQuantity/:id', async (req, res) => {
            const id = req.params.id;
            const updatedObject = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    quantity: updatedObject.quantity,

                }
            }

            const result = await itemsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(filter);
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
