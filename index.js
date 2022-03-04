const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4wgcq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();

        const database = client.db('travel-agency');
        const servicesCollection = database.collection('services');
        const bookingsCollection = database.collection('bookings')

        // post services data
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        })
        //get all services data
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        
        // get single service data by id 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await servicesCollection.findOne(query);
            res.json(result);
        })

        // post booking data
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.json(result);
        })

        // get booking data by email
        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = {email: email};
            console.log(query);
            const cursor = bookingsCollection.find(query);
            const bookings = await cursor.toArray();
            res.json(bookings)
        })

        //get all booking data
        app.get('/allBookings', async (req, res) => {
            const cursor = bookingsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // get bookings data by id
        app.get('/allBookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await bookingsCollection.findOne(query);
            res.send(result);
        })

        // delete booking data
        app.delete('/allBookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await bookingsCollection.deleteOne(query);
            res.json(result)
        })

        // update status
        app.put('/allBookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const updateDoc = {$set: {status: 'approved'}};
            const result = await bookingsCollection.updateOne(query, updateDoc);
            res.json(result)
        })
        

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel Day Server')
})

app.listen(port, () => {
    console.log('Travel Day Server Running On', port)
});

