const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
  credentials:true,
  origin:[
    'https://scc-technovision-inc.web.app',
    'https://scc-technovision-inc.firebaseapp.com',
    'http://localhost:5173'
  ]
}));
app.use(express.json());

console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hepooac.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const toDoTaskCollection = client.db("sccTechno").collection("toDoTasks");

    // tasks related apis
    app.post("/toDoTasks", async (req, res) => {
      const item = req.body;
      const result = await toDoTaskCollection.insertOne(item);
      res.send(result);
    });

    app.get("/toDoTasks", async (req, res) => {
      const result = await toDoTaskCollection.find().toArray();
      res.send(result);
    });

    app.delete("/toDoTasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toDoTaskCollection.deleteOne(query);
      res.send(result);
    });

    // // update task
    app.put("/toDoTasks/:_id", async (req, res) => {
      const id = req.params._id;
      const filter = { _id: new ObjectId(id) };
      const updated = req.body;
      const update = {
        $set: {
          name: updated.name,
          brand: updated.brand,
          type: updated.type,
          price: updated.price,
          description: updated.description,
          image: updated.image,
          rating: updated.rating,
        },
      };
      const result = await toDoTaskCollection.updateOne(filter, update);
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

// server connection for all project
app.get("/", (req, res) => {
  res.send("setUp server running");
});
app.listen(port, () => {
  console.log(`setUp project server running on PORT: ${port}`);
});
