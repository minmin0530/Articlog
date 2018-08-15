class PluginTest1 {
  constructor() {
  }
  print(MongoClient, url, dbName, fs, __dirname, hoge) {

    console.log('print');
    let result = '';
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
      const db = client.db(dbName);
      const collection = db.collection('article');
      console.log('mongodb');
      collection.find({}).toArray( (err, docs) => {
        console.log(docs.length);
        for (const doc of docs) {
          // app.get('/' + doc.link.substring(0, doc.link.length - 5), (req, res) => {
          //   res.sendFile(__dirname + '/html/' + doc.link);
          // });

          fs.readFile(__dirname + '/html/' + doc.link, (err, data) => {
            //result += data;
            return data;
          });
      


        }
      });
    });
  




//    return 'plugin-a:' + result;
  }
};

exports = PluginTest1;