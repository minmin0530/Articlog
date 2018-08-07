class Login {
  constructor (socket) {
    this.socket = socket;
    this.certificationFlag = false;
    this.socket.on('connect', function () {
    });
    this.socket.on('login_home', function () {

      document.getElementById('home').style.visibility = 'visible';
      document.getElementById('login-sign-up').style.visibility = 'hidden';
      document.getElementById('login-sign-up').style.width = '0px';
      document.getElementById('login-sign-up').style.height = '0px';
      document.getElementById('login').style.visibility = 'hidden';
      document.getElementById('login').style.width = '0px';
      document.getElementById('login').style.height = '0px';
      document.getElementById('sign-up').style.visibility = 'hidden';
      document.getElementById('sign-up').style.width = '0px';
      document.getElementById('sign-up').style.height = '0px';
    });
  }
  certification () {
    this.certificationFlag = true;
    this.loginData = {mail:'', password:''};// = document.getElementById("display");
    this.loginData.mail = document.getElementById("mail").value;
    this.loginData.password = document.getElementById("password").value;
    this.socket.emit('loginData', this.loginData);
  }
  sign_up () {
    this.signUpData = {name:'', mail:'', password:''};// = document.getElementById("display");
    this.signUpData.name = document.getElementById("sign_up_name").value;
    this.signUpData.mail = document.getElementById("sign_up_mail").value;
    this.signUpData.password = document.getElementById("sign_up_password").value;
    this.socket.emit('signUpData', this.signUpData);

  }
};