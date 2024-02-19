// Recupera i riferimenti ai form di registrazione e accesso
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

// Recupera i riferimenti ai campi di input di registrazione e accesso
const signupUsername = document.getElementById('signup-username');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');

// Registrazione degli utenti
signupForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Recupera i dati dal form di registrazione
  const username = signupUsername.value;
  const email = signupEmail.value;
  const password = signupPassword.value;

  // Crea un nuovo oggetto utente
  const user = {
    username: username,
    email: email,
    password: password,
    credits: 5
  };

  // Recupera l'elenco degli utenti dal localStorage
  var userList = JSON.parse(localStorage.getItem('userList')) || []; //se c'è prendi userList altrimenti array vuoto
  
  //Creazione lista di album
  var albumList = JSON.parse(localStorage.getItem('albumList')) || []; //se c'è prendi albumList altrimenti array vuoto
  var album = { //creo un oggetto album con all'interno un array di carte
    cards: []
  }
  
  // Aggiunge il nuovo utente all'elenco
  if(userList.find(user => user.username == username)){
    alert('utente già esistente');
    signupForm.reset();
  }else{
    userList.push(user);
    // Salva l'elenco aggiornato degli utenti sul localStorage
    localStorage.setItem('userList', JSON.stringify(userList));
    // Resetta il form di registrazione
    //aggiungo all'array un album vuoto
    albumList.push(album);
  
    localStorage.setItem('albumList', JSON.stringify(albumList));
    signupForm.reset();
    
    // Visualizza un messaggio di conferma
    alert('Registrazione completata con successo!');
  }
});

// Accesso degli utenti
loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Recupera i dati dal form di accesso
  const username = loginUsername.value;
  const password = loginPassword.value;

  // Recupera l'elenco degli utenti dal localStorage
  const userList = JSON.parse(localStorage.getItem('userList')) || [];

  // Cerca l'utente corrispondente
  if (username == "" || password == "") {
    alert("Inserisci username e password")
  } else {
    const user = userList.find(function (u) {
      return u.username === username && u.password === password;
    });

    // Se l'utente esiste, salva i suoi dati sulla sessionStorage e reindirizza alla home page
    if (user) {
      var index = userList.findIndex((u) => u.username == username && u.password == password);
      window.localStorage.setItem("logIndex", JSON.stringify(index));
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'home/home.html';
    } else {
      // Altrimenti visualizza un messaggio di errore
      alert('Username o password errati!');
    }

    // Resetta il form di accesso
    loginForm.reset();
  }

});
