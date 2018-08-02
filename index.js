const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'myproject';
 
const insertAccount = function(db, account, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insert(account, function(err, result) {
     assert.equal(err, null);
    // assert.equal(3, result.result.n);
    // assert.equal(3, result.ops.length);
    // console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}


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
  const collection = db.collection('documents');
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

const fs = require('fs');
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/articlog.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/articlog.com/fullchain.pem')
//  ca: [fs.readFileSync(__dirname + '/middle.cer'), 'utf8'],
//  ciphers:'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:......'
};
 
const server = https.createServer(options, app);

const io = require('socket.io')(server);
io.sockets.on('connection', (socket) => {
  socket.on('loginData', (loginData) => {
    console.log(loginData.mail);
    console.log(loginData.password);

    MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
     
      const db = client.db(dbName);

      const collection = db.collection('documents');
      // Find some documents
      collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);

        for (const doc of docs) {
          if (loginData.mail == doc.mail && loginData.password == doc.password) {
            socket.emit('login_home', 'user_yoshiki');
            break;
          }
        }
      });
    });
    // if (loginData.mail == "aaa" && loginData.password == "bbb") {
    //   socket.emit('login_home', 'user_yoshiki');
    // }
  });
  socket.on('signUpData', (signUpData) => {
    console.log(signUpData.name);
    console.log(signUpData.mail);
    console.log(signUpData.password);
    // if (loginData.mail == "aaa" && loginData.password == "bbb") {
    //   socket.emit('login_home', 'user_yoshiki');
    // }

    MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
     
      const db = client.db(dbName);
        insertAccount(db, signUpData, function() {
          findDocuments(db, function() {
            client.close();
          });
        });
    });
    



  });
});
app.get('/download', (req, res) => {
  res.download(__dirname + '/index.js');
});
app.get('/', (req, res) => {
  res.send("hello world!");// res.sendFile(__dirname + '/html/index.html');
});
app.get('/index.css', (req, res) => {  res.sendFile(__dirname + '/css/index.css'); });
app.get('/s_author.JPG', (req, res) => {  res.sendFile(__dirname + '/img/s_author.JPG'); });
app.get('/s_author.png', (req, res) => {  res.sendFile(__dirname + '/img/s_author.png'); });
app.get('/qiita.png', (req, res) => {  res.sendFile(__dirname + '/img/qiita.png'); });
app.get('/github.png', (req, res) => {  res.sendFile(__dirname + '/img/github.png'); });
app.get('/twitter.png', (req, res) => {  res.sendFile(__dirname + '/img/twitter.png'); });
// app.get('/login', (req, res) => {  res.sendFile(__dirname + '/login/login.html'); });
app.get('/login.js', (req, res) => {  res.sendFile(__dirname + '/home/login.js'); });
// app.get('/login.css', (req, res) => {  res.sendFile(__dirname + '/login/login.css'); });
app.get('/home', (req, res) => {  res.sendFile(__dirname + '/home/home.html'); });
app.get('/home.js', (req, res) => {  res.sendFile(__dirname + '/home/home.js'); });
app.get('/home.css', (req, res) => {  res.sendFile(__dirname + '/home/home.css'); });
server.listen(443);
http.createServer(app).listen(80);

