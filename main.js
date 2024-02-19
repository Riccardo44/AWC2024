// Recupera i riferimenti ai form di acquisto crediti e acquisto pacchetti
const buyCreditsForm = document.getElementById('buy-credits-form');
const buyPacksForm = document.getElementById('buy-packs-form');

// Recupera i riferimenti ai campi di input di acquisto crediti e acquisto pacchetti
const creditsAmount = document.getElementById('credits-amount-input');
const packsAmount = document.getElementById('packs-amount-input');

// Recupera il riferimento al div che contiene l'elenco dei supereroi
const superheroesList = document.getElementById('superheroes-list');
//Recupera la lista di utenti salvata
const users = JSON.parse(window.localStorage.getItem('userList'));
//Recupera l'indice dell'utente loggato
const currentUser = users[JSON.parse(window.localStorage.getItem('logIndex'))];
const albumList = JSON.parse(window.localStorage.getItem('albumList'));
const currentUserAlbum = albumList[JSON.parse(window.localStorage.getItem('logIndex'))] //all'utente zero corrisponde l'album zero

//CARICA FRASI INIZIALE 
function loadInfo() {
  document.getElementById('credits-amount-info').innerText = currentUser.credits;
  if (currentUserAlbum.cards.length > 0) {
    document.getElementById('albumInfo').innerText = 'Il tuo album contiene ' + currentUserAlbum.cards.length + ' carte';
  } else {
    document.getElementById('albumInfo').innerText = 'Il tuo album non contiene carte';
  }
  numeriDuplicati();
  loadCards();
}



//CONTEGGIA E CREA DUPLICATES IN LOCAL STORAGE E INIZIA A CARICARE CARD 
function loadCards() {
  var albumList = JSON.parse(window.localStorage.getItem('albumList'));  // Recupera la lista degli album dal localStorage
  var logIndex = JSON.parse(window.localStorage.getItem('logIndex')); // Recupera l'indice dell'utente loggato dal localStorage
  var cards = albumList[logIndex].cards;// Recupera l'array di carte dell'utente loggato
  var uniqueCard = [...new Set(cards.map(card => parseInt(card, 10)).filter(card => !isNaN(card)))];  // Crea un array di ID unici dalle carte dell'utente
  const duplicates = {};// Oggetto che conterrà il numero di duplicati per ogni ID
  cards.forEach(id => { duplicates[id] = (duplicates[id] || 0) + 1; });// Calcola il numero di duplicati per ogni ID e aggiorna l'oggetto 'duplicates'

  // Recupera il database dal localStorage
  var db = JSON.parse(window.localStorage.getItem('database'));

  // Salva l'oggetto 'duplicates' nel localStorage
  window.localStorage.setItem('duplicates', JSON.stringify(duplicates));

  // Ottiene l'elemento HTML con l'ID 'row'
  var row = document.getElementById('row');
  row.innerHTML = "";

  // Mostra le informazioni sui supereroi unici nell'elemento HTML 'row'
  for (var i = 0; i < uniqueCard.length; i++) {
    showSuperhero(db.find(obj => obj.id === uniqueCard[i]));
  }
}

//CARICA CARD INSERENDO HTML 
function showSuperhero(superhero) {
  var duplicates = JSON.parse(window.localStorage.getItem('duplicates'));
  var id = superhero.id
  var numDuplicate = duplicates[id] - 1;
  //console.log('id :', id, 'nome:', superhero.name)
  var rowElement = document.getElementById('row');

    rowElement.innerHTML +=
    '<div class="col">' +
    '<div class="card">' +
    '<div class="card-side front">' +
    '<img src="' + superhero.thumbnail.path + '.' + superhero.thumbnail.extension + '" class="card-img-top">' +
    '<div class="card-body">' +
    '<div class="d-flex w-100">'+
    "<button type='button' style='padding:10px; border-radius: 0px 0px 0px 10px;' class='btn btn-secondary' onclick=\"showInfo('" + id + "')\">" +
    '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">'+
    '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>'+
    '<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path></svg>'+
    '</button>'+
    '<div style="text-align: center; margin-top: 10px;" class="col-10">'+
    '<h5 class="card-title">' + superhero.name + '</h5>' +
    '<h5>Quantità: ' + (parseInt(numDuplicate) + 1) + '</h5>' + 
    "<button type='button' class='btn btn-primary' onclick=\"trade('" + id + "')\"> Scambia </button>" +
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'
  
}


function numeriDuplicati(){
  var albumList = JSON.parse(window.localStorage.getItem('albumList'));
  var cards = albumList[JSON.parse(window.localStorage.getItem('logIndex'))].cards;
  var uniqueCard = [...new Set(cards.map(card => parseInt(card, 10)).filter(card => !isNaN(card)))];

  const duplicates = {};//oggetto che utilizzo come una mappa
  // Calcola il numero di duplicati per ogni ID
  //La scelta di utilizzare una callback in questo caso consente di separare la logica di conteggio dall'iterazione dell'array. La funzione forEach si occupa di gestire l'iterazione, mentre la callback si occupa della logica specifica di conteggio e aggiornamento dell'oggetto duplicates. Questo rende il codice più modulare, leggibile e riutilizzabile.
  cards.forEach(id => { duplicates[id] = (duplicates[id] || 0) + 1; });//chiave-valore
  var n = 0;
  Object.keys(duplicates).forEach(key => {
    if (duplicates[key] > 1) {
      //n+=1;
      n+=duplicates[key]-1;
    }
  });
  document.getElementById('duplicateInfo').innerText ='  -  Numero doppioni: ' + n;
}









function getHeroNameFromDB(id) {
  var db = JSON.parse(window.localStorage.getItem('database'));
  console.log('Sto cercando nel DB id: ', id)
  var superhero = db.find(obj => obj.id == id);
  console.log('Ho trovato questo eroe:', superhero)
  return superhero.name;
}


function getFromMarvel(url, query = "") {
  var MD5 = function (d) { var r = M(V(Y(X(d), 8 * d.length))); return r.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0; for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ }
  var timestamp = Date.now();
  var publicApiKey = "b620e750d0cfcaa8ff3b70679002bd0b"
  //var publicApiKey = "c7715daff78aec71c2721552bb6ef32c"
  var privateApiKey = "afe0fa822ec6013974fe93dcbbee931147b02a24"
  //var privateApiKey = "dac0fd1fc57af59305a51fe4bac190866f8452f1"
  var parameters = `ts=${timestamp}&apikey=${publicApiKey}&hash=${MD5(timestamp + privateApiKey + publicApiKey)}&`

  return fetch(`http://gateway.marvel.com/v1/${url}${query}?${parameters}`)
    .then(response => response.json())
    .catch(error => console.log('error', error));
}

function getFromMarvel(url, query = "") {
  var MD5 = function(d) { var r = M(V(Y(X(d), 8 * d.length))); return r.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0; for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ }
  var timestamp = Date.now();
  var publicApiKey = "b620e750d0cfcaa8ff3b70679002bd0b"
  var privateApiKey = "afe0fa822ec6013974fe93dcbbee931147b02a24"
  var parameters = `ts=${timestamp}&apikey=${publicApiKey}&hash=${MD5(timestamp + privateApiKey + publicApiKey)}&`

  return fetch(`http://gateway.marvel.com/v1/${url}?${parameters}${query}`)
    .then(response => response.json())
    .catch(error => console.log('error', error));
}


function getComicsName(id) {
  var db = JSON.parse(window.localStorage.getItem('database'))
  var superhero = db.find(obj => obj.id == id);
  var comicsList = ""
  for (var i = 0; i < superhero.comics.items.length; i++) {
    comicsList += superhero.comics.items[i].name + ", "
  }
  if (superhero.comics.items.length == 0) {
    comicsList = "No comics available"
  }
  return comicsList
}

function getEventsName(id) {
  var db = JSON.parse(window.localStorage.getItem('database'))
  var superhero = db.find(obj => obj.id == id);
  var eventsList = ""
  for (var i = 0; i < superhero.events.items.length; i++) {
    eventsList += superhero.events.items[i].name + ", "
  }
  if (superhero.events.items.length == 0) {
    eventsList = "No events available"
  }
  return eventsList
}

function getSeriesName(id) {
  var db = JSON.parse(window.localStorage.getItem('database'))
  var superhero = db.find(obj => obj.id == id);
  var seriesList = ""
  for (var i = 0; i < superhero.series.items.length; i++) {
    seriesList += superhero.series.items[i].name + ", "
  }
  if (superhero.series.items.length == 0) {
    seriesList = "No series available"
  }
  return seriesList
}

function getStoriesName(id) {
  var db = JSON.parse(window.localStorage.getItem('database'))
  var superhero = db.find(obj => obj.id == id);
  var storiesList = ""
  for (var i = 0; i < superhero.stories.items.length; i++) {
    storiesList += superhero.stories.items[i].name + ", "
  }
  if (superhero.stories.items.length == 0) {
    storiesList = "No stories available"
  }
  return storiesList
}

function getDescription(id) {
  var db = JSON.parse(window.localStorage.getItem('database'))
  var superhero = db.find(obj => obj.id == id);
  var description = superhero.description
  if (description == "") {
    description = "No description available"
  }
  return description
}

//Popup info 
function showInfo(id) {
  var db = JSON.parse(window.localStorage.getItem('database'))
  var superhero = db.find(obj => obj.id == id);
  console.log('...Superhero:', superhero)
  //Aggiungere informazioni prese dal database ai vari <p>
  document.getElementById('name-field').innerText = superhero.name
  document.getElementById('comics-field').innerText = getComicsName(id)
  // document.getElementById('description-field').innerText = getDescription(id)
  document.getElementById('events-field').innerText = getEventsName(id)
  document.getElementById('series-field').innerText = getSeriesName(id)
  document.getElementById('stories-field').innerText = getStoriesName(id)
  document.getElementById('info-div').style.display = 'block'
}

function closePopup() {
  document.getElementById('info-div').style.display = 'none';
}






//-------------ACQUISTA


function canBuyPacks(amount) {
//VERIFICA SE L'UTENTE HA ABBASTANZA CREDITI PER EFFETTUARE L'ACQUISTO DEI PACCHETTI
  return currentUser.credits >= amount;
}


  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newPack() {
  console.log("Funzione newPack chiamata");

  var db = window.localStorage.getItem('database');
  if (db == null) {
      db = [];
      window.localStorage.setItem('database', JSON.stringify(db));
  } else {
      db = JSON.parse(db);
  }

  var users = JSON.parse(window.localStorage.getItem('userList'));
  var logIndex = JSON.parse(window.localStorage.getItem('logIndex'));

  // Inizializza currentUserAlbum come un array vuoto se è null o undefined
  var currentUserAlbum = albumList[JSON.parse(localStorage.getItem('logIndex'))]?.cards || [];

  if (users[logIndex].credits > 0) {
      users[logIndex].credits -= 1;
      window.localStorage.setItem('userList', JSON.stringify(users));

      var credits = users[logIndex].credits;
      alert('Acquisto avvenuto con successo! Ti rimangono ' + credits + ' crediti');
      var limit = 1;
      var chiamateAsincroneAPIMArvel = [];

      for (var i = 0; i < 5; i++) {
          var offset = getRandomInt(0, 1000);

          // Creazione di una promessa per ciascuna chiamata asincrona
          chiamateAsincroneAPIMArvel.push(
              getFromMarvel('public/characters', `limit=${limit}&offset=${offset}`).then(
                  result => {
                      //console.log("Risultato della chiamata a getFromMarvel:", result);
                      currentUserAlbum.push(result.data.results[0].id);
                      addToDatabase(result.data.results[0]);
                      albumList[JSON.parse(localStorage.getItem('logIndex'))].cards = currentUserAlbum;
                      window.localStorage.setItem('albumList', JSON.stringify(albumList));
                      console.log("Nuova lista album:", albumList);
                      //console.log("Visualizzazione del supereroe:", result.data.results[0]);
                  }
              )
          );
      }
      // Attendere che tutte chiamate asincrone API marvel siano risolte prima di aggiornare la pagina
      Promise.all(chiamateAsincroneAPIMArvel).then(() => {
          document.getElementById('credits-amount-info').innerText = users[logIndex].credits;
          document.getElementById('albumInfo').innerText = 'Il tuo album contiene: ' + currentUserAlbum.length + ' carte';
          window.location.reload();
      });
  } else {
      alert('Non hai abbastanza crediti');
  }
}


/*a causa del ratelimit ogni volta che apriamo un pacco ci salviamo nel db tutte le info dell'erore in maniera tale che nella hompage se abbiamo 100 carte non dobbiamo mandare 100 richieste e se dobbiamo prendere il nome di un eroe per un trading, non possiamo fare una richiesta solo per prendere il nome*/
function newCredits(){

}


function addToDatabase(superhero){
    var db = JSON.parse(window.localStorage.getItem('database'));
    if(!db.some(obj => obj.id === superhero.id)){
        db.push(superhero);
        console.log(superhero.id, "non c'è nel db, lo aggiungo");
        window.localStorage.setItem('database',JSON.stringify(db));
    }else{
        console.log(superhero.id,"c'è già");
    }

}

function buyCredits() {
    currentUser.credits += 1;
    users[JSON.parse(window.localStorage.getItem('logIndex'))] = currentUser
    window.localStorage.setItem('userList', JSON.stringify(users));
    alert('crediti acquistati con successo');
    document.getElementById('credits-amount-info').innerText = currentUser.credits;
}






//-------------TRADE

function trade(idTrade) {
  // Recupera i dati necessari dalla localStorage
  var albumList = JSON.parse(window.localStorage.getItem('albumList'))
  var logIndex = JSON.parse(window.localStorage.getItem('logIndex'))
  var myAlbum = albumList[logIndex].cards
  var trades = window.localStorage.getItem('trades');
  var duplicates = JSON.parse(window.localStorage.getItem('duplicates'));
  var numDuplicate = duplicates[idTrade];
  
  // gestisce la situazione in cui non ci sono ancora informazioni sugli scambi memorizzate nella localStorage
  if (trades == null) {
    trades = [];
  } else {
    trades = JSON.parse(trades);
  }

  //inserisce in trades local storage la figurina da scambiare e elimina in album list
  if (numDuplicate > 1) {
    if (existingTrade(trades, idTrade, window.localStorage.getItem('logIndex'))) {
      alert('Hai già inserito uno scambio per questa carta')
    } else {
      var trade = {
        "idTradeFrom": idTrade,
        "from": window.localStorage.getItem('logIndex'),
        "idTradeTo": "",
        "to": "",
      };
      trades.push(trade);
      window.localStorage.setItem('trades', JSON.stringify(trades));

      //elima in album list
      myAlbum = deleteTradedCard(parseInt(idTrade), myAlbum) 
      albumList[logIndex].cards = myAlbum
      window.localStorage.setItem('albumList', JSON.stringify(albumList))


      alert('Scambio per ' + getHeroNameFromDB(idTrade) + ' inserito con successo!')
      window.location.href = "home.html"
    }
  } else {
    alert('Non puoi scambiare una carta di cui non hai doppioni')
  }
}

function tradeOffer(i) {
  var db = JSON.parse(window.localStorage.getItem('database'));
  var dupilcates = JSON.parse(window.localStorage.getItem('duplicates'));
  var albumList = JSON.parse(window.localStorage.getItem('albumList'));
  var trades = JSON.parse(window.localStorage.getItem('trades'));
  var trade = trades[i];
  var tradedHeroId = trade.idTradeFrom;
  var tradedUserIndex = trade.from;
  //console.log('----', trade);
  var tradedHero = db.find(obj => obj.id == trade.idTradeFrom);
  var select = document.getElementById('myCards');
  



  select.innerHTML = "";
  //console.log(typeof dupilcates);
  var dup = getDuplicateIds(dupilcates);
  //console.log('----dup:', dup);
  //console.log('----dup.length > 0:', dup.length > 0);
  if (dup.length > 0) {
    document.getElementById('dop').style.display = 'block'
    for (var j = 0; j < dup.length; j++) {
      var superhero = db.find(obj => obj.id == dup[j]);
      //console.log(dup[j]);
      select.innerHTML += '<option value="' + dup[j] + '">' + superhero.name + '</option>'
    }
    document.getElementById('hero-name').innerText = tradedHero.name;
  } else {
    document.getElementById('no-dop').style.display = 'block'
  }

  document.getElementById('trade-div').style.display = 'block';
  window.localStorage.setItem('selectedTrade', JSON.stringify(i))
}

function getDuplicateIds(obj) {
  const result = [];

  for (const key in obj) {
    if (obj[key] > 1) {
      result.push(key);
    }
  }

  return result;
}

function loadTrades() {
  var trades = JSON.parse(window.localStorage.getItem('trades'));
  var userList = JSON.parse(window.localStorage.getItem('userList'))
  var albumList = JSON.parse(window.localStorage.getItem('albumList'));
  var db = JSON.parse(window.localStorage.getItem('database'));
  var row = document.getElementById('trade-row')
  var myRow = document.getElementById('my-trade-row')
  var pendingRow = document.getElementById('pending-trade-row')
  var logIndex = JSON.parse(window.localStorage.getItem('logIndex'));
  row.innerHTML = "";
  myRow.innerHTML = "";
  pendingRow.innerHTML = "";
  // --- Caricamento scambi messi da altri utenti ---
  for (var i = 0; i < trades.length; i++) {
    var trade = trades[i]
    if (parseInt(trade.from) != logIndex) {
      if (trade.to === "") {
        var superhero = db.find(obj => obj.id == trade.idTradeFrom);
        var img = superhero.thumbnail.path + '.' + superhero.thumbnail.extension
        row.innerHTML += '<div class="col"><span class="span-bold">Utente: </span>' + userList[trades[i].from].username + '</div>' +
          '<div class="col"><span class="span-bold">Scambia: </span>' + superhero.name + '</div>' +
          '<div class="col">' + "<button type='button' class='btn btn-primary' onclick=\"tradeOffer('" +
          i +
          "')\"> Proponi scambio </button>" + '</div>'
          + '<div class="vertical-spacer"></div>';
      }
    }
  }
  if (row.innerHTML != "") {
    document.getElementById('no-trades').style.display = 'none'
  }
  // --- Caricamento scambi messi dall'utente loggato ---
  for (var i = 0; i < trades.length; i++) {
    var trade = trades[i]
    // --- Se non ci sono proposte di altri utenti per questo scambio ---
    if (parseInt(trade.from) == logIndex && trade.idTradeTo == "") {
      var superhero = db.find(obj => obj.id == trade.idTradeFrom);
      var img = superhero.thumbnail.path + '.' + superhero.thumbnail.extension
      myRow.innerHTML += '<div class="col"><span class="span-bold">Sto scambiando: </span>' + superhero.name + '</div>' +
        '<div class="col"><p>Al momento non ci sono proposte per questo scambio</p></div>'
        + '<div class="vertical-spacer"></div>';
    }
    // --- Se ci sono proposte di altri utenti per questo scambio ---
    if (parseInt(trade.from) == logIndex && trade.idTradeTo != "") {
      var superhero = db.find(obj => obj.id == trade.idTradeFrom);
      var tradedSuperhero = db.find(obj => obj.id == trade.idTradeTo);
      myRow.innerHTML += '<div class="col"><span class="span-bold">Sto scambiando: </span>' + superhero.name + '</div>' +
        + '<div class="col"><span class="span-bold">Utente: </span>' + userList[trades[i].to].username + '</div>' +
        '<div class="col"><span class="span-bold">Mi sta proponendo: </span>' + tradedSuperhero.name + '</div>' +
        '<div class="col">' + "<button type='button' class='btn btn-success' onclick=\"acceptOffert('" +
        i +
        "')\"> Accetta lo scambio </button>" + '</div>' +
        '<div class="col">' + "<button type='button' class='btn btn-danger' onclick=\"declineOffert('" +
        i +
        "')\"> Rifiuta lo scambio </button>" + '</div>'
        + '<div class="vertical-spacer"></div>';
    }
  }
  if (myRow.innerHTML != "") {
    document.getElementById('no-my-trades').style.display = 'none'
  }
  // --- Caricamento proposte di scambio dell'utente loggato ---
  for (var i = 0; i < trades.length; i++) {
    var trade = trades[i]
    // console.log('typeof trade.to: ', typeof trade.to, "=", parseInt(trade.from))
    // console.log('typeof logIndex: ', typeof logIndex, "=", logIndex)
    // console.log('trade.from == logIndex: ', parseInt(trade.to) == logIndex)
    if (parseInt(trade.to) == logIndex) {
      var superhero = db.find(obj => obj.id == trade.idTradeFrom);
      var mySuperhero = db.find(obj => obj.id == trade.idTradeTo);
      var img = superhero.thumbnail.path + '.' + superhero.thumbnail.extension
      var myImg = mySuperhero.thumbnail.path + '.' + mySuperhero.thumbnail.extension
      pendingRow.innerHTML += '<div class="col"><span class="span-bold">Utente: </span>' + userList[trades[i].from].username + '</div>' +
        '<div class="col"><span class="span-bold">Scambia: </span>' + superhero.name + '</div>' +
        '<div class="col"><span class="span-bold">Io ho proposto: </span></div>' +
        '<div class="col"><span class="span-bold">Eroe: </span>' + mySuperhero.name + '</div>' +
        '<div class="vertical-spacer"></div>';

    }
  }
  if (pendingRow.innerHTML != "") {
    document.getElementById('no-pending-trades').style.display = 'none'
  }
}

function getHeroNameFromDB(id) {
  var db = JSON.parse(window.localStorage.getItem('database'));
  console.log('Sto cercando nel DB id: ', id)
  var superhero = db.find(obj => obj.id == id);
  console.log('Ho trovato questo eroe:', superhero)
  return superhero.name;
}

function confirmTrade() {
  var trades = JSON.parse(window.localStorage.getItem('trades'))
  var tradeNumber = JSON.parse(window.localStorage.getItem('selectedTrade'))
  var trade = trades[tradeNumber]
  var albumList = JSON.parse(window.localStorage.getItem('albumList'))
  var logIndex = JSON.parse(window.localStorage.getItem('logIndex'))
  var album = albumList[logIndex]
  alert('Voglio scambiare la carta ' + getHeroNameFromDB(document.getElementById('myCards').value) + ' per la carta: ' + getHeroNameFromDB(trade.idTradeFrom))
  trade.idTradeTo = document.getElementById('myCards').value
  trade.to = logIndex
  trades[tradeNumber] = trade
  window.localStorage.setItem('trades', JSON.stringify(trades))
  alert('Lo scambio della tua carta ' + getHeroNameFromDB(document.getElementById('myCards').value) + ' per la carta: ' + getHeroNameFromDB(trade.idTradeFrom) + ' è stato aggiunto con successo!')
  // console.log('---Prima:', album.cards)
  album.cards = deleteTradedCard(parseInt(trade.idTradeTo), album.cards)
  // console.log('---Dopo:', album.cards)
  albumList[logIndex].cards = album.cards
  // console.log('---Dopo2:', albumList[logIndex].cards)
  window.localStorage.setItem('albumList', JSON.stringify(albumList))
  document.getElementById('trade-div').style.display = 'none';
  window.localStorage.removeItem('selectedTrade')
  window.location.href = 'trade.html'
}

function deleteTradedCard(id, album) {
  const index = album.indexOf(id);
  if (index > -1) {
    album.splice(index, 1);
    console.log('ID tolto')
  }
  return album;
}

function acceptOffert(i) {
  var albumList = JSON.parse(window.localStorage.getItem('albumList'))
  var logIndex = JSON.parse(window.localStorage.getItem('logIndex'))
  var myAlbum = albumList[logIndex].cards
  var trades = JSON.parse(window.localStorage.getItem('trades'))
  var trade = trades[i]
  var idTradedCard = trade.idTradeFrom;
  var idObtainedCard = trade.idTradeTo;
  var otherUserIndex = trade.to
  var otherUserAlbum = albumList[otherUserIndex].cards
  console.log('Other user album: ' + otherUserAlbum)
  //Tolgo idTradedCard dal mio album
  console.log('--------------------------')
  console.log('Tolgo idTradedCard dal mio album:')
  console.log('myAlbum prima: ' + myAlbum.length)
  myAlbum = deleteTradedCard(parseInt(idTradedCard), myAlbum)
  console.log('myAlbum dopo: ' + myAlbum.length)
  console.log('--------------------------')
  //Aggiungo idTradedCard all'album dell'utente che mi ha proposto la carta
  console.log('--------------------------')
  console.log("Aggiungo idTradedCard all'album dell'utente che mi ha proposto la carta:")
  console.log('otherUserAlbum prima: ' + otherUserAlbum.length)
  otherUserAlbum.push(parseInt(idTradedCard))
  console.log('otherUserAlbum dopo: ' + otherUserAlbum.length)
  console.log('--------------------------')
  //Aggiungo idObtainedCard al mio album
  console.log('--------------------------')
  console.log('Aggiungo idObtainedCard al mio album:')
  console.log('myAlbum prima: ' + myAlbum.length)
  myAlbum.push(parseInt(idObtainedCard))
  console.log('myAlbum dopo: ' + myAlbum.length)
  console.log('--------------------------')
  //Rimuovo il trade dalla lista dei trades
  console.log('Rimuovo il trade dalla lista dei trades:')
  console.log('trades prima: ' + trades.length)
  trades.splice(i, 1)
  console.log('trades dopo: ' + trades.length)
  console.log('--------------------------')
  // Salvataggio delle modifiche nel local storage:
  albumList[logIndex].cards = myAlbum
  albumList[otherUserIndex].cards = otherUserAlbum
  window.localStorage.setItem('albumList', JSON.stringify(albumList))
  window.localStorage.setItem('trades', JSON.stringify(trades))
  alert('Per lo scambio di ' + getHeroNameFromDB(idTradedCard) + ' hai accettato la carta: ' + getHeroNameFromDB(idObtainedCard))
  console.clear()
  window.location.href = "trade.html"

}

function declineOffert(i) {
  var trades = JSON.parse(window.localStorage.getItem('trades'))
  var albumList = JSON.parse(window.localStorage.getItem('albumList'))
  var trade = trades[i]
  var idTradedCard = parseInt(trade.idTradeFrom);
  var idRefusedCard = parseInt(trade.idTradeTo);
  var otherUser = trade.to;
  var otherUserAlbum = albumList[otherUser].cards

  otherUserAlbum.push(idRefusedCard)
  albumList[otherUser].cards = otherUserAlbum

  trade.to = ""
  trade.idTradeTo = ""

  window.localStorage.setItem('trades', JSON.stringify(trades))
  window.localStorage.setItem('albumList', JSON.stringify(albumList))

  alert('Per lo scambio di ' + getHeroNameFromDB(idTradedCard) + ' ho rifiutato la carta: ' + getHeroNameFromDB(idRefusedCard))

  window.location.href = "trade.html"
}


function addCard(id) {
  const albumList = JSON.parse(localStorage.getItem('albumList'));
  const currentUserAlbum = albumList[JSON.parse(localStorage.getItem('logIndex'))].cards; //all'utente zero corrisponde l'album zero
  currentUserAlbum.push(id);
  albumList[JSON.parse(localStorage.getItem('logIndex'))].cards = currentUserAlbum;
  window.localStorage.setItem('albumList', JSON.stringify(albumList));
}

function existingTrade(list, idTrade, logIndex) {
  return list.some(obj => obj.idTradeFrom === idTrade && obj.from === logIndex);
}


