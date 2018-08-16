class PluginTest1 {
  constructor() {
  }
  async print(MongoClient, url, dbName, fs, __dirname, hoge) {

    async function returnHTML() {
      let result = '';
      const client = await MongoClient.connect(url, { useNewUrlParser: true });
      const db = await client.db(dbName);
        
      // //検索(`toArray()`版)
      // const docs = await db.collection('article').find({}).toArray()
      // console.log(docs)
    
      //検索(カーソル版) 
      let html = '';
      let begin = 0;
      let end = 0;
      const cursor = db.collection('article').find({})
      while(await cursor.hasNext()) {
        let doc   = await cursor.next();
        html      = await fs.readFileSync(__dirname + '/html/' + doc.link);
        begin     = html.toString().indexOf('<section>');
        end       = html.toString().indexOf('</section>') + 10;
        result   += end;//doc.time;
        result   += html.toString().substring(begin, end);
      }
      end = html.toString().indexOf('</article>');
      result += end;
      const begin_html = html.toString().substring(0, begin);
      const end_html = html.toString().substring(end, html.length);
    
      //DB切断
      await client.close()
    


//      const html = await fs.readFileSync(__dirname + '/html/' + result);

      return begin_html + result + end_html;//data.map(x => { //何かする })











/*


      let result = '0';
      await MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {     
        const db = client.db(dbName);
        const collection = db.collection('article');
        result += '1';
        collection.find({}).toArray( (err, docs) => {
          result += '2';
          for (const doc of docs) {
            // app.get('/' + doc.link.substring(0, doc.link.length - 5), (req, res) => {
            //   res.sendFile(__dirname + '/html/' + doc.link);
            // });
            result += '3';
  
            return doc.link;
  
            // fs.readFile(__dirname + '/html/' + doc.link, (err, data) => {
            //   //result += data;
            //   return data;
            // });
        
  
  
          }
          result += '4';
          return result;
  
        });
        result += '5';
        return result;
  
      });
    
  */
  
  
  
///      return 'plugin-a:' + result;
      }
    return await returnHTML();
  }
};

exports = PluginTest1;