class PluginTest1 {
  constructor() {
  }
  print(MongoClient, url, dbName, fs, hoge) {

    let result = '';
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
      const db = client.db(dbName);
      const collection = db.collection('article');
      collection.find({}).toArray( (err, docs) => {
        for (const doc of docs) {
          // app.get('/' + doc.link.substring(0, doc.link.length - 5), (req, res) => {
          //   res.sendFile(__dirname + '/html/' + doc.link);
          // });

          fs.readFile(__dirname + '/html/' + doc.link, (err, data) => {
            result += data;
          });
      


        }
      });
    });
  




    return 'plugin-a:' + result;
  }
};

exports = PluginTest1;