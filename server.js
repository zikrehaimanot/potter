// console.log('May Node be with you')
const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://demo:demo@potter-dgojz.mongodb.net/test?retryWrites=true&w=majority";


var db

app.listen(process.env.PORT || 4000, () => {
MongoClient.connect(uri,{ useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
  db = database.db('quotes')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('potter').find().toArray((err, result) => {
      if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
    })
})
app.post('/quotes', (req, res) => {
  db.collection('potter').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('potter')
  .findOneAndUpdate({name: 'voldermort'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('potter').findOneAndDelete({name:req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'Harry deleted'})
  })
})
