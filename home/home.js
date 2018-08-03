class Home {
  constructor(socket) {
    this.socket = socket;
    this.socket.on('connect', function () {
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

    const sendData = {
      content: this.textarea.value,
      link:    this.inputLink.value,
      title:   this.inputTitle.value
    }

    this.buttonPublish.addEventListener('click', () => {
      this.socket.emit('publish', sendData);
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
  }
  article_list(url_txt) {
  }
  image_upload() {
  }
  image_list() {
  }
  setting() {
  }
  plugin() {
  }
  change(file) {
  }
};
