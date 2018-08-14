class Home {
  constructor(socket) {
    this.socket = socket;
    this.socket.on('connect', () => {
    });
    this.article  = document.getElementById('article');
    this.div      = document.createElement('div');
    this.buttonDiv= document.createElement('div');
    this.linkDiv  = document.createElement('div');
    this.titleDiv = document.createElement('div');
    this.inputButtonDiv = document.createElement('div');
    this.inputDiv = document.createElement('div');
    this.textarea = document.createElement('textarea');
    this.iframe   = document.createElement('iframe');
    this.inputLink  = document.createElement('input');
    this.inputTitle = document.createElement('input');
    this.spanLink  = document.createElement('span');
    this.spanTitle = document.createElement('span');
    this.buttonPreview  = document.createElement('button');
    this.buttonSave    = document.createElement('button');
    this.buttonPublish = document.createElement('button');

    this.uploadDiv = document.createElement('div');
    this.form = document.createElement('form');
    this.inputFile = document.createElement('input');
    this.inputSubmit = document.createElement('input');

    this.inputFile.type = 'file';
    this.inputFile.name = 'file';
    this.inputSubmit.type = 'submit';
    this.inputSubmit.value = 'Upload File';
    this.form.action = 'file_upload';
    this.form.method = 'POST';
    this.form.enctype = 'multipart/form-data';

    this.form.appendChild(this.inputFile);
    this.form.appendChild(this.inputSubmit);
    this.uploadDiv.appendChild(this.form);

    this.inputButtonDiv.style.display = 'flex';
    this.inputButtonDiv.style.width = '100%';
    

    this.linkDiv.style.display = 'flex';
    this.titleDiv.style.display = 'flex';
    this.linkDiv.style.width = '400px';
    this.titleDiv.style.width = '400px';

    this.spanLink.textContent = 'パーマリンク';
    this.spanTitle.textContent = 'タイトル';
    this.spanLink.style.width = '100px';
    this.spanTitle.style.width = '100px';

    this.linkDiv.appendChild(this.spanLink);
    this.linkDiv.appendChild(this.inputLink);
    this.titleDiv.appendChild(this.spanTitle);
    this.titleDiv.appendChild(this.inputTitle);

    this.inputDiv.appendChild(this.linkDiv);
    this.inputDiv.appendChild(this.titleDiv);
    this.inputButtonDiv.appendChild(this.inputDiv);

    this.buttonDiv.style.display = 'flex';
    this.buttonDiv.style.width = '400px';

    this.buttonPreview.textContent = 'プレビュー';
    this.buttonPreview.className = 'square_btn';
    this.buttonPreview.style.width = '100px';

    this.buttonSave.textContent = '保存';
    this.buttonSave.className = 'square_btn';
    this.buttonSave.style.width = '100px';

    this.buttonPublish.textContent = '公開';
    this.buttonPublish.className = 'square_btn';
    this.buttonPublish.style.width = '100px';

    document.addEventListener("keydown", (e) => {
      this.iframe.srcdoc = this.textarea.value;
    });
  } 
  home() {
  }
  init_write_article() {
    this.textarea.style.margin = "20px";
    this.textarea.style.width = "512px";
    this.textarea.style.height = "512px";

    this.iframe.style.margin = "20px";
    this.iframe.style.width = "512px";
    this.iframe.style.height = "512px";

    this.iframe.srcdoc = "<h1>test</h1>テスト文章<h2>テスト見出し</h2>こまごまとした文章";

    this.div.style.display = "flex";
    this.div.style.width = "1280px";

    this.article.innerHTML = '';

    this.buttonDiv.appendChild(this.buttonPreview);
    this.buttonDiv.appendChild(this.buttonSave);
    this.buttonDiv.appendChild(this.buttonPublish);
    this.buttonDiv.style.marginLeft = '400px';
    this.inputButtonDiv.appendChild(this.buttonDiv);
    this.article.appendChild(this.inputButtonDiv);

    this.div.appendChild(this.textarea);
    this.div.appendChild(this.iframe);
    this.article.appendChild(this.div);

    this.buttonPublish.addEventListener('click', () => {
      this.socket.emit('publish', {
        time:    new Date().toLocaleString(),
        content: this.textarea.value,
        link:    this.inputLink.value,
        title:   this.inputTitle.value
      });
    });
    this.socket.on('published', (data) => {

      const linkCard = document.createElement('div');
      linkCard.style.position = "absolute";
      linkCard.style.top = "400px";
      linkCard.style.left = "600px";
      linkCard.style.width = "400px";
      linkCard.style.height = "200px";
      linkCard.style.background = "#fff";
      linkCard.style.border = "solid #008 5px";
      linkCard.style.padding = "50px";
      linkCard.innerHTML = "公開できました。<br><a href='https://articlog.com/" + data.link + "'>" + data.title + "</a>";

      document.body.appendChild(linkCard);
    }); 
  }
  init_write_css() {
    this.textarea.style.margin = "20px";
    this.textarea.style.width = "512px";
    this.textarea.style.height = "512px";

    this.iframe.style.margin = "0px";
    this.iframe.style.width = "0px";
    this.iframe.style.height = "0px";

    this.div.style.display = "flex";
    this.div.style.width = "1280px";

    this.article.innerHTML = '';
    this.div.appendChild(this.textarea);
    this.div.appendChild(this.iframe);
    this.article.appendChild(this.div);
  }
  init_write_template() {
  }
  init_write_js() {
  }
  init_article_list() {
    this.socket.emit('article_list');
    this.socket.on('article_list', (list) => {
      this.article.innerHTML = '';

      for (const item of list) {
        const btn = document.createElement('button');
        btn.addEventListener('click', this.edit, false);
        btn.eventParam = item.link;
        btn.textContent = "編集";
        const a = document.createElement('a');
        a.href = item.link.substring(0, item.link.length - 5);
        a.textContent = item.link.substring(0, item.link.length - 5);
        this.article.appendChild(a);
        this.article.appendChild(btn);
        ++this.l;
      }
    });
  }
  init_src_list() {
    this.socket.emit('src_list');
    this.socket.on('src_list', (list) => {
      this.article.innerHTML = '';
      for (const item of list) {
        const btn = document.createElement('button');
        btn.addEventListener('click', this.edit, false);
        btn.eventParam = item.link;
        btn.textContent = "編集";
        const span = document.createElement('span');
        span.href = item.link;
        span.textContent = item.link;
        this.article.appendChild(span);
        this.article.appendChild(btn);
        ++this.l;
      }
    });
  }
  upload() {
    this.article.innerHTML = '';
    this.article.appendChild(this.uploadDiv);
  }
  image_list() {
  }
  setting() {
  }
  plugin() {
  }
  change(file) {
  }
  edit(event) {
    home.socket.emit('edit_article', event.target.eventParam);
    home.socket.on('edit_article', (data) => {
      home.textarea.style.margin = "20px";
      home.textarea.style.width = "512px";
      home.textarea.style.height = "512px";
      if (data.indexOf('.html') > 0) {
        home.textarea.value = large_buffer_to_string(data);
      } else {
        home.textarea.value = data;
      }
      
      home.iframe.style.margin = "20px";
      home.iframe.style.width = "512px";
      home.iframe.style.height = "512px";
  
      if (data.indexOf('.html') > 0) {
        home.iframe.srcdoc = large_buffer_to_string(data);
      } else {
        home.iframe.srcdoc = data;
      }
  
      home.div.style.display = "flex";
      home.div.style.width = "1280px";
  
      home.article.innerHTML = '<h1>編集</h1>' + event.target.eventParam;
      home.inputLink.value = event.target.eventParam.substring(0, event.target.eventParam.length - 5);
      home.inputTitle.value = event.target.eventParam.substring(0, event.target.eventParam.length - 5);

      home.buttonDiv.appendChild(home.buttonPreview);
      home.buttonDiv.appendChild(home.buttonSave);
      home.buttonDiv.appendChild(home.buttonPublish);
      home.buttonDiv.style.marginLeft = '400px';
      home.inputButtonDiv.appendChild(home.buttonDiv);
      home.article.appendChild(home.inputButtonDiv);
  
      home.div.appendChild(home.textarea);
      home.div.appendChild(home.iframe);
      home.article.appendChild(home.div);
  
      home.buttonPublish.addEventListener('click', () => {
        home.socket.emit('edit_publish', {
          time:    new Date().toLocaleString(),
          content: home.textarea.value,
          link:    home.inputLink.value,
          title:   home.inputTitle.value
        });
      });
  
    });
    home.socket.on('edit_published', (data) => {

      const linkCard = document.createElement('div');
      linkCard.style.position = "absolute";
      linkCard.style.top = "400px";
      linkCard.style.left = "600px";
      linkCard.style.width = "400px";
      linkCard.style.height = "200px";
      linkCard.style.background = "#fff";
      linkCard.style.border = "solid #008 5px";
      linkCard.style.padding = "50px";
      linkCard.innerHTML = "公開できました。<br><a href='https://articlog.com/" + data.link + "'>" + data.title + "</a>";

      document.body.appendChild(linkCard);
    });
  }
};

function buffer_to_string(buf) {
  return String.fromCharCode.apply("", new Uint8Array(buf))
}

// ただし、文字列が長すぎる場合は RangeError: Maximum call stack size exceeded. が発生してしまう。
// 以下は1024バイト単位に分割して処理する場合

function large_buffer_to_string(buf) {
  var tmp = [];
  var len = 1024;
  for (var p = 0; p < buf.byteLength; p += len) {
    tmp.push(buffer_to_string(buf.slice(p, p + len)));
  }
  return tmp.join("");
}