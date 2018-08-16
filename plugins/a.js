class PluginTest1 {
  constructor() {
  }
  async print(MongoClient, url, dbName, fs, __dirname, hoge) {

    async function returnHTML() {
      let result = '';
      const client = await MongoClient.connect(url, { useNewUrlParser: true });
      const db = await client.db(dbName);
        
      // //検索(`toArray()`版)
      //  const docs = await db.collection('article').remove({});
      //  console.log(docs)
    
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
        const d = doc.time;
        result = doc.time;/*
        d.getFullYear() + '/' +
        (d.getMonth() + 1) + '/' +
        d.getDate() + ' ' +
        d.getHours() + ':' +
        d.getMinutes();*/
        result   += html.toString().substring(begin, end);
      }

      end = html.toString().indexOf('</article>');
      const begin_html = html.toString().substring(0, begin);
      const end_html = html.toString().substring(end, html.length);
    
      //DB切断
      await client.close()
      return begin_html + result + end_html;
    }
    return await returnHTML();
  }
};

exports = PluginTest1;