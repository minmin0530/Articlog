class PluginTest1 {
  constructor() {
  }
  async print(MongoClient, url, dbName, fs, __dirname) {

    async function returnHTML() {
      let result = '';
      const client = await MongoClient.connect(url, { useNewUrlParser: true });
      const db = await client.db(dbName);
        
      // //検索(`toArray()`版)
  //      const docs = await db.collection('article').remove({});
  //      console.log(docs)
    
      //検索(カーソル版) 
      let html = '';
      let begin = 0;
      let end = 0;
      const cursor = db.collection('article').find({}).sort({'_id': -1});

      // io.sockets.on('connection', (socket) => {
      //   socket.on('nextPage', () => {
      //     console.log("nextPage.");
      //   });
      //   console.log("connected.");
      // });

      // for (let l = 0; l < 4; ++l) {
      while(await cursor.hasNext()) {
        let doc   = await cursor.next();
        html      = await fs.readFileSync(__dirname + '/html/' + doc.link);
        begin     = html.toString().indexOf('<section>') + 9;
        end       = html.toString().indexOf('</section>') + 10;

        let h1begin = html.toString().indexOf('<h1>');
        let h1end = html.toString().indexOf('</h1>') + 5;
        result += '<section><a href="' + doc.link.substring(0, doc.link.length - 5) + '">' + html.toString().substring(h1begin, h1end) + '</a>';

        const d = doc.time;
        result += '<br>' +
        d.getFullYear() + '/' +
        (d.getMonth() + 1) + '/' +
        d.getDate() + ' ' +
        d.getHours() + ':' +
        d.getMinutes() + '<br>'; 
        result += html.toString().substring(begin, end);
      }
      begin = html.toString().indexOf('<article>') + 9;
      end = html.toString().indexOf('</article>');
      const begin_html = html.toString().substring(0, begin);
      const end_html = html.toString().substring(end, html.length);
      const pagination = '<a href="next20">次へ</a>';
      //DB切断
      await client.close()
      return begin_html + result + pagination + end_html;
      // return begin_html + result + end_html;
    }
    return await returnHTML();
  }
};

exports = PluginTest1;