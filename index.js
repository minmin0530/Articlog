const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
const url = 'mongodb://localhost:27017'; 
const dbName = 'myproject';
 
const insertAccount = function(db, account, callback) {
  const collection = db.collection('account');
  collection.insert(account, (err, result) => {
    callback(result);
  });
}

const insertArticle = function(db, article, callback) {
  const collection = db.collection('article');
  collection.insert(article, (err, result) => {
    callback(result);
  });
}

/*
const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('account');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

const removeDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}

const removeAllDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Delete document where a is 3
  collection.remove({}, function(err, result) {
    assert.equal(err, null);
//    assert.equal(1, result.result.n);
    console.log("Removed the document with the all fields");
    callback(result);
  });    
}
*/
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/articlog.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/articlog.com/fullchain.pem')
};
 
const server = https.createServer(options, app);

const io = require('socket.io')(server);
io.sockets.on('connection', (socket) => {
  socket.on('loginData', (loginData) => {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
      const db = client.db(dbName);
      const collection = db.collection('account');
      collection.find({}).toArray( (err, docs) => {
        for (const doc of docs) {
          if (loginData.mail == doc.mail && loginData.password == doc.password) {
            socket.emit('login_home', doc.name);
            break;
          }
        }
      });
    });
  });
  socket.on('signUpData', (signUpData) => {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
      const db = client.db(dbName);
      insertAccount(db, signUpData, () => {
        // findDocuments(db, function() {
        //   client.close();
        // });
      });
    });
  });
  socket.on('publish', (publishData) => {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
      const db = client.db(dbName);
      insertArticle(db, publishData, () => {
        linkArticle();
        socket.emit('published', publishData);
        // findDocuments(db, function() {
        //   client.close();
        // });
      });
    });
  });
});

function linkArticle() {
  MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
    const db = client.db(dbName);
    const collection = db.collection('article');
    collection.find({}).toArray( (err, docs) => {
      for (const doc of docs) {
        app.get('/' + doc.link, (req, res) => {
          res.send(doc.content);
        });
      }
    });
  });
}
linkArticle();
app.get('/', (req, res) => {
  res.send("hello world!");// res.sendFile(__dirname + '/html/index.html');
});
app.get('/index.css', (req, res) => {  res.sendFile(__dirname + '/css/index.css'); });
app.get('/s_author.JPG', (req, res) => {  res.sendFile(__dirname + '/img/s_author.JPG'); });
app.get('/s_author.png', (req, res) => {  res.sendFile(__dirname + '/img/s_author.png'); });
app.get('/qiita.png', (req, res) => {  res.sendFile(__dirname + '/img/qiita.png'); });
app.get('/github.png', (req, res) => {  res.sendFile(__dirname + '/img/github.png'); });
app.get('/twitter.png', (req, res) => {  res.sendFile(__dirname + '/img/twitter.png'); });
app.get('/login.js', (req, res) => {  res.sendFile(__dirname + '/home/login.js'); });
app.get('/home', (req, res) => {  res.sendFile(__dirname + '/home/home.html'); });
app.get('/home.js', (req, res) => {  res.sendFile(__dirname + '/home/home.js'); });
app.get('/home.css', (req, res) => {  res.sendFile(__dirname + '/home/home.css'); });
server.listen(443);
http.createServer(app).listen(80);

