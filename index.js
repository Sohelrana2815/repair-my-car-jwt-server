const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5q2fm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log("connection string : ", uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db("serviceDB").collection("services");
    const bookingCollection = client.db("serviceDB").collection("bookings");

    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = {
        projection: { title: 1, img: 1, price: 1 },
      };
      const result = await serviceCollection.findOne(filter, options);
      res.send(result);
    });

    // bookings related apis

    app.post("/bookings", async (req, res) => {
      const customerInfo = req.body;
      console.log(customerInfo);
      const result = await bookingCollection.insertOne(customerInfo);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car server running...");
});

app.listen(port, () => {
  console.log(`Car server running on port ${port}`);
});
