const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n2xq8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("volunteer").collection("event");
 app.get('/product' , (req, res ) => {
   productCollection.find()
   .toArray((err, items) => {
      res.send(items)
   })
 })

 const ObjectID = require('mongodb').ObjectID
 app.delete('/deleteProduct/:id',(req,res)=>{
  const id=ObjectID(req.params.id);
  productCollection.deleteOne({_id: id})
  .then((err,documents)=>res.send(documents))
})


  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
});
client.connect(err => {const orderCollection = client.db("volunteer").collection("order");
  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/order',(req,res) => {
    orderCollection.find({email: req.query.email})
    .toArray((err,data)=> {
      res.send(data)
    })
  })
});

app.listen(process.env.PORT || port)