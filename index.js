const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:5000', 'http://localhost:5173']
}));
app.use(express.json());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.mj6vep2.mongodb.net/?appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        //Collections
        const db = client.db('dylan_estate');
        collection = db.collection('properties');

        // Add Property
        app.post('/addProperty', async (req, res) => {
            const property = req.body;
            console.log('New Property', property);
            const result = await collection.insertOne(property);
            res.send(result);
        });

        // * Get Details
        app.get('/propertyDetails/:phoneEmail', async (req, res) => {
            try {
                const phoneEmail = req.params.phoneEmail;
                const query = { phoneEmail: phoneEmail }; 
                const result = await collection.findOne(query);

                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ message: 'Property not found' });
                }
            } catch (error) {
                console.error('Error fetching property details:', error);
                res.status(500).send({ message: 'Internal Server Error' });
            }
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Dylan Estate');
});

app.listen(port, () => {
    console.log(`Dylan Estate Running on Port ${port}`);
});