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

function loadInfo() {
  document.getElementById('credits-amount-info').innerText = currentUser.credits;
  if (currentUserAlbum.cards.length > 0) {
    document.getElementById('albumInfo').innerText = 'Il tuo album contiene ' + currentUserAlbum.cards.length + ' carte';
  } else {
    document.getElementById('albumInfo').innerText = 'Il tuo album non contiene carte';
  }
  loadCards();
}

/*function buyCredits() {
  currentUser.credits += 1;
  users[JSON.parse(window.localStorage.getItem('logIndex'))] = currentUser
  window.localStorage.setItem('userList', JSON.stringify(users));
  alert('crediti acquistati con successo');
  document.getElementById('credits-amount-info').innerText = currentUser.credits;
}*/

function loadCards() {
  var albumList = JSON.parse(window.localStorage.getItem('albumList'));
  var cards = albumList[JSON.parse(window.localStorage.getItem('logIndex'))].cards;

  // Array senza duplicati
  // var uniqueCard = [...new Set(cards)];
  var uniqueCard = [...new Set(cards.map(card => parseInt(card, 10)).filter(card => !isNaN(card)))];

  // Oggetto che conterrà il numero di duplicati per ogni ID
  const duplicates = {};//oggetto che utilizzo come una mappa

  // Calcola il numero di duplicati per ogni ID
  //La scelta di utilizzare una callback in questo caso consente di separare la logica di conteggio dall'iterazione dell'array. La funzione forEach si occupa di gestire l'iterazione, mentre la callback si occupa della logica specifica di conteggio e aggiornamento dell'oggetto duplicates. Questo rende il codice più modulare, leggibile e riutilizzabile.
  cards.forEach(id => { duplicates[id] = (duplicates[id] || 0) + 1; });//chiave-valore
  var db = JSON.parse(window.localStorage.getItem('database'));
  console.log('uniqueCard', uniqueCard);
  console.log('duplicates', duplicates);
  window.localStorage.setItem('duplicates', JSON.stringify(duplicates));
  var row = document.getElementById('row');
  row.innerHTML = "";

  for (var i = 0; i < uniqueCard.length; i++) {
    /*getFromMarvel('public/characters/', uniqueCard[i]).then(//.then è una promessa
      superhero => { //callback
        showSuperhero(superhero.data.results[0])
      }
    );*/
    showSuperhero(db.find(obj => obj.id === uniqueCard[i]));
  }
}
// Recupera l'utente corrente dal session storage
/*const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
currentUser.credits = 5;
currentUser.figurines= [];
sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
*/

// Recupera l'elenco dei supereroi dal localStorage o lo inizializza se non esiste
//let superheroes = JSON.parse(localStorage.getItem('superheroes')) || [];

const publicApiKey = "b620e750d0cfcaa8ff3b70679002bd0b"
const privateApiKey = "afe0fa822ec6013974fe93dcbbee931147b02a24"

// Funzione per recuperare l'elenco dei supereroi tramite le API REST della Marvel
/*async function getSuperheroes() {
    const response = await fetch(`https://gateway.marvel.com/v1/public/characters?apikey=${publicApiKey}`);
    const data = await response.json(); // significa "aspetta che ti arriva la risposta dalla marvel e trasformala in json"
    /* superheroes = data.data.results.map(result => {
        return {
            id: result.id,
            name: result.name,
            thumbnail: `${result.thumbnail.path}/portrait_fantastic.${result.thumbnail.extension}`
        };
    });
    localStorage.setItem('superheroes', JSON.stringify(data.data.results));//con'data.data.results' otteniamo le info di cui abbiamo bisogno al posto della var superheroes che ci seleziona solo alcuni dati come id,name,thumbnail
    displaySuperheroes();
}*/

// Funzione per mostrare l'elenco dei supereroi nella pagina
// function displaySuperheroes() {
//     superheroesList.innerHTML = '';
//     superheroes.forEach(superhero => {
//         const superheroCard = document.createElement('div');
//         superheroCard.className = 'superhero-card';
//         superheroCard.innerHTML = `
//       <img src="${superhero.thumbnail}" alt="${superhero.name}">
//       <div class="superhero-name">${superhero.name}</div>
//     `;
//         superheroesList.appendChild(superheroCard);
//     });
// }

/*function displaySuperheroes() {
    var superheroes = JSON.parse(window.localStorage.getItem('superheroes'))
    var superHeroList = document.getElementById('row');
    superHeroList.innerHTML = '';
    superheroes.forEach(superhero => { //superhero è dichiarata qua quindi come se fosse 'i-esimo'
        superHeroList.innerHTML+='<div class="col">'
                                    + '<div class="card">'
                                    + '<div class="card-side front">'//utilizziamo le proprietà sia di side che di front
                                    + '<img src=" '+ superhero.thumbnail.path + "." + superhero.thumbnail.extension+' " class="card-img-top">'//
                                    + '<div class= "card-body">'
                                    + '<h5 class= "card-title">'+ superhero.name + '</h5>'
                                    + '</div>'
                                    + '</div>'
                                    + '</div>'
                                +'</div>';
        //superheroesList.appendChild(superheroCard);
    });
}*/

// Verifica se l'utente ha abbastanza crediti per effettuare l'acquisto dei pacchetti
function canBuyPacks(amount) {
  return currentUser.credits >= amount;
}

// Funzione per l'acquisto di pacchetti di figurine
function buyPacks(amount) {
  // Verifica se l'utente ha abbastanza crediti per effettuare l'acquisto
  if (canBuyPacks(amount)) {
    // Sottrae il costo dell'acquisto dal saldo dell'utente
    currentUser.credits -= amount;

    // Crea un array vuoto per le nuove figurine acquistate
    const newFigurines = [];

    // Aggiunge pacchetti di figurine casuali all'array
    for (let i = 0; i < amount; i++) {
      const randomIndex = Math.floor(Math.random() * superheroes.length);
      newFigurines.push(superheroes[randomIndex]);
    }

    // Aggiunge le nuove figurine acquistate all'elenco delle figurine dell'utente
    currentUser.figurines.push(...newFigurines);

    // Salva l'utente aggiornato nel session storage
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Mostra un messaggio di successo all'utente
    alert(`Hai acquistato ${amount} pacchetti di figurine!`);

    // Aggiorna la visualizzazione delle informazioni dell'utente
    displayUserInfo();


  } else {
    // Mostra un messaggio di errore all'utente
    alert(`Non hai abbastanza crediti per acquistare ${amount} pacchetti di figurine`);
  }
}

// Funzione per l'acquisto di crediti
/*function buyCredits(amount) {
  // Aggiunge il numero di crediti acquistati al saldo dell'utente
  currentUser.credits += amount;

  // Salva l'utente aggiornato nel session storage
  sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

  // Mostra un messaggio di successo all'utente
  alert(`Hai acquistato ${amount} crediti!`);

  // Aggiorna la visualizzazione delle informazioni dell'utente
  displayUserInfo();
}*/

// Funzione per la visualizzazione delle informazioni dell'utente
/*function displayUserInfo() {
    const creditsInfo = document.getElementById('credits-info');
    const figurinesInfo = document.getElementById('figurines-info');
    creditsInfo.innerHTML = `Crediti: ${ currentUser.credits }`;
    figurinesInfo.innerHTML = `Figurine: ${ currentUser.figurines.length }`;
}

// Listener per la sottomissione del form di acquisto crediti
buyCreditsForm.addEventListener('submit', event => {
    event.preventDefault();
    const amount = parseInt(creditsAmount.value);
    if (amount > 0) {
        buyCredits(amount);
        creditsAmount.value = '';
    } else {
        alert('Inserisci un importo valido.');
    }
});
// Listener per la sottomissione del form di acquisto pacchetti
buyPacksForm.addEventListener('submit', event => {
    event.preventDefault();
    const amount = parseInt(packsAmount.value);
    if (amount > 0) {
        buyPacks(amount);
        packsAmount.value = '';
    } else {
        alert('Inserisci un importo valido.');
    }
});*/

// Avvia l'applicazione
/*getSuperheroes();
displayUserInfo();*/



function showSuperhero(superhero) {
  var duplicates = JSON.parse(window.localStorage.getItem('duplicates'));
  var id = superhero.id
  var numDuplicate = duplicates[id] - 1;
  console.log('id :', id, 'nome:', superhero.name)
  var rowElement = document.getElementById('row');
  //var expandedCardElement = document.getElementById('expandedCard');
  //   rowElement.innerHTML += `
  //   <div class="col">
  //     <div class="card">
  //       <div class="card-side front">
  //         <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" class="card-img-top">
  //         <div class="card-body">
  //           <h5 class="card-title">${superhero.name}</h5>
  //           <h5>Doppioni: ${numDuplicate}</h5>
  //           <button type="button" class="btn btn-primary" id="action-button-${id}" onclick="trade('${id}')">Scambia</button>
  //           <button type="button" class="btn btn-secondary">Info</button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // `;
  rowElement.innerHTML +=
    '<div class="col">' +
    '<div class="card">' +
    '<div class="card-side front">' +
    '<img src="' + superhero.thumbnail.path + '.' + superhero.thumbnail.extension + '" class="card-img-top">' +
    '<div class="card-body">' +
    '<h5 class="card-title">' + superhero.name + '</h5>' +
    '<h5>Doppioni: ' + numDuplicate + '</h5>' +
    "<button type='button' class='btn btn-primary' onclick=\"trade('" + id + "')\"> Scambia </button>" +
    "<button type='button' class='btn btn-secondary card-button' onclick=\"showInfo('" + id + "')\"> Info </button>" +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';

  /*function expandCard(id) {
    var button = document.getElementById(`action-button-${id}`);
    var card = button.parentNode.parentNode; // Ottieni il genitore del genitore del bottone (la carta)
    card.classList.add('expanded');
  
    // Copia il contenuto della carta espansa nel div dell'elemento espanso
    var expandedCardContent = card.querySelector('.card-side.back').innerHTML;
    expandedCardElement.innerHTML = expandedCardContent;
    expandedCardElement.style.display = 'block';
  }*/
}

function getHeroNameFromDB(id) {
  var db = JSON.parse(window.localStorage.getItem('database'));
  console.log('Sto cercando nel DB id: ', id)
  var superhero = db.find(obj => obj.id == id);
  console.log('Ho trovato questo eroe:', superhero)
  return superhero.name;
}


function trade(idTrade) {
  var albumList = JSON.parse(window.localStorage.getItem('albumList'))
  var logIndex = JSON.parse(window.localStorage.getItem('logIndex'))
  var myAlbum = albumList[logIndex].cards
  var trades = window.localStorage.getItem('trades');
  if (trades == null) {
    trades = [];
  } else {
    trades = JSON.parse(trades);
  }
  var duplicates = JSON.parse(window.localStorage.getItem('duplicates'));
  var numDuplicate = duplicates[idTrade];
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
      console.log('prima: ' + myAlbum.length)
      console.log('typeof idTrade: ' + parseInt(idTrade))
      console.log('typeof myAlbum[0]: ' + typeof myAlbum[0])
      myAlbum = deleteTradedCard(parseInt(idTrade), myAlbum)
      console.log('dopo: ' + myAlbum.length)
      albumList[logIndex].cards = myAlbum
      window.localStorage.setItem('albumList', JSON.stringify(albumList))
      alert('Scambio per ' + getHeroNameFromDB(idTrade) + ' inserito con successo!')
      window.location.href = "home.html"
    }
  } else {
    alert('Non puoi scambiare una carta di cui non hai doppioni')
  }
}

function deleteTradedCard(id, album) {
  const index = album.indexOf(id);
  if (index > -1) {
    album.splice(index, 1);
    console.log('ID tolto')
  }
  return album;
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
  document.getElementById('info-div').style.display = 'none'
}