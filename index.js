const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require("multer");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const ev = new EventEmitter();

app.use(bodyParser.urlencoded( { extended: false }));
app.use(multer({dest: './tmp/'}).single('file'));

const url = 'mongodb://localhost:27017'; 
const dbName = 'myproject';
 
const insertAccount = (db, account, callback) => {
  const collection = db.collection('account');
  collection.insert(account, (err, result) => {
    callback(result);
  });
}

const insertArticle = (db, article, callback) => {
  const collection = db.collection('article');
  collection.insert(article, (err, result) => {
    callback(result);
  });
}
const insertSrc = (db, src, callback) => {
  const collection = db.collection('src');
  collection.insert(src, (err, result) => {
    callback(result);
  });
}
const insertPlugin = (db, article, callback) => {
  const collection = db.collection('plugin');
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
      let insertData = {
        link: publishData.link + '.html',
        time: new Date().toLocaleString()
      };
      insertArticle(db, insertData, () => {
        fs.writeFileSync(__dirname + '/html/' + insertData.link, publishData.content);
        linkArticle();
        socket.emit('published', publishData);
        // findDocuments(db, function() {
        //   client.close();
        // });
      });
    });
  });
  socket.on('article_list', () => {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
      const db = client.db(dbName);
      const collection = db.collection('article');
      collection.find({}).toArray( (err, docs) => {
            socket.emit('article_list', docs);
      });
    });
  });
  socket.on('src_list', () => {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
      const db = client.db(dbName);
      const collection = db.collection('src');
      collection.find({}).toArray( (err, docs) => {
            socket.emit('src_list', docs);
      });
    });
  });
  socket.on('edit_src', (linkData) => {
    fs.readFile(__dirname + '/src/' + linkData, (err, data) => {
      socket.emit('edit_src', data);
    });
  });
  socket.on('edit_src_publish', (publishData) => {
    fs.writeFileSync(__dirname + '/src/' + publishData.link, publishData.content);
    socket.emit('edit_src_published', publishData);
  });

  socket.on('edit_article', (linkData) => {
    fs.readFile(__dirname + '/html/' + linkData, (err, data) => {
      socket.emit('edit_article', encodeURI(data));
    });
  });
  socket.on('edit_publish', (publishData) => {
    fs.writeFileSync(__dirname + '/html/' + publishData.link + '.html', publishData.content);
    socket.emit('edit_published', publishData);
  });
});

function linkSrc() {
  MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
    const db = client.db(dbName);
    const collection = db.collection('src');
    collection.find({}).toArray( (err, docs) => {
      for (const doc of docs) {
        app.get('/' + doc.link, (req, res) => {
          res.sendFile(__dirname + '/src/' + doc.link);
        });
      }
    });
  });
}
linkSrc();

function linkArticle() {
  MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
    const db = client.db(dbName);
    const collection = db.collection('article');
    collection.find({}).toArray( (err, docs) => {
      for (const doc of docs) {
        app.get('/' + doc.link.substring(0, doc.link.length - 5), (req, res) => {
          res.sendFile(__dirname + '/html/' + doc.link);
        });
      }
    });
  });
}
linkArticle();

function linkPlugin() {
  MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
    const db = client.db(dbName);
    const collection = db.collection('plugin');
    collection.find({}).toArray( (err, docs) => {
      for (const doc of docs) {
        app.get('/' + doc.link, (req, res) => {
          res.sendFile(__dirname + '/plugins/' + doc.link);
        });
      }
    });
  });
}
linkPlugin();

app.post('/file_upload', (req, res) => {
  fs.readFile(req.file.path, (err, data) => {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
      const db = client.db(dbName);
      let insertData = {
            link: req.file.originalname,
            time: new Date().toLocaleString()
      };
      console.log(req.file.originalname);
      if (req.file.originalname.indexOf(".html") >= 1) {
        insertArticle(db, insertData, () => {
          fs.writeFileSync(__dirname + '/html/' + req.file.originalname, data.toString());
          linkArticle();
        });
      } else {
        insertSrc(db, insertData, () => {
          fs.writeFileSync(__dirname + '/src/' + req.file.originalname, data.toString());
          linkSrc();
        });
      }
      res.sendFile(__dirname + '/home/home.html');
    });
  });
});

app.post('/plugin_upload', (req, res) => {
  fs.readFile(req.file.path, (err, data) => {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
      const db = client.db(dbName);
      let insertData = {
            link: req.file.originalname,
            time: new Date().toLocaleString()
      };
      console.log(req.file.originalname);
      insertPlugin(db, insertData, () => {
        fs.writeFileSync(__dirname + '/plugins/' + req.file.originalname, data.toString());
        linkPlugin();
      });
      res.sendFile(__dirname + '/home/home.html');
    });
  });
});



app.get('/', (req, res) => {  res.sendFile(__dirname + '/html/webgl.html'); });
app.get('/login.js', (req, res) => {  res.sendFile(__dirname + '/home/login.js'); });
app.get('/home', (req, res) => {  res.sendFile(__dirname + '/home/home.html'); });
app.get('/home.js', (req, res) => {  res.sendFile(__dirname + '/home/home.js'); });
app.get('/home.css', (req, res) => {  res.sendFile(__dirname + '/home/home.css'); });

app.get('/plugin', function(req, res) {
  let pluginsDir = path.join(__dirname, 'plugins');
  let pluginObjects = [];
  console.log(pluginsDir);
  fs.readdirSync(pluginsDir).forEach(file => {
    if (path.extname(file) !== '.js') {
      return;
    }
    pluginObjects.push( path.join(pluginsDir, file));
    console(file);
  });

  let result = '';
  for (var v = 0; v < pluginObjects.length; ++v) {
    var obj = loadObject(fs, pluginObjects[v]);
    var pluginTest = new obj();
    result += pluginTest.print('hoge') + '<br>';
    console.log(v);
  }
  console.log(result);
  res.send(result);
});

function loadObject (fs, file) {
  var sandbox = {};
  var script = vm.createScript(fs.readFileSync(file, 'utf8'), file);
  script.runInNewContext(sandbox);
  return sandbox.exports;
};

server.listen(443);
http.createServer(app).listen(80);

