const index = JSON.parse(window.localStorage.getItem("logIndex"));
const users = JSON.parse(window.localStorage.getItem("userList"));
function loadInfo() {
    document.getElementById("profilePageUserName").innerText = users[index].username;
}

function modifyProfile() {
    document.getElementById("deleteContainer").style.display = "none";
    document.getElementById("modifyContainer").style.display = "block";
    document.getElementById("mainContainer").style.display = "none";
    var usernameField = document.getElementById("username");
    usernameField.defaultValue = users[index].username;
}

function logout() {
    window.location.href = '../index.html';
}

function deleteProfile() {
    document.getElementById("modifyContainer").style.display = "none";
    document.getElementById("deleteContainer").style.display = "block";
    document.getElementById("mainContainer").style.display = "none";
}

function undo() {
    document.getElementById("modifyContainer").style.display = "none";
    document.getElementById("deleteContainer").style.display = "none";
    document.getElementById("mainContainer").style.display = "block";
}

function modifyUserName() {
    document.getElementById("deleteContainer").style.display = "none";
    document.getElementById("modifyContainer").style.display = "block";
    document.getElementById("modifyUserName").style.display = "block";
    document.getElementById("mainContainer").style.display = "none";
    var usernameField = document.getElementById("username");
    usernameField.defaultValue = users[index].username;
}

function modifyPassword() {
    document.getElementById("deleteContainer").style.display = "none";
    document.getElementById("modifyContainer").style.display = "block";
    document.getElementById("modifyPassword").style.display = "block";
    document.getElementById("mainContainer").style.display = "none";
    var passwordField = document.getElementById("password");
    passwordField.defaultValue = users[index].password;
}

function undoModify() {
    document.getElementById("deleteContainer").style.display = "none";
    document.getElementById("modifyContainer").style.display = "none";
    document.getElementById("modifyUserName").style.display = "none";
    document.getElementById("mainContainer").style.display = "block";
    document.getElementById("modifyPassword").style.display = "none";
}

function editUserName() {
    var editedUser = document.getElementById("username").value;
    var password = document.getElementById("passwordUserName").value
    if (editedUser.lenght < 3) {
        alert("nome utente troppo corto")
    } else {
        if (password == users[index].password) {
            users[index].username = editedUser;
            window.localStorage.setItem("userList", JSON.stringify(users));
            window.location.href = "profile.html";
        } else {
            alert("password errata");
        }
    }
}

function editPassword() {
    var editedPass = document.getElementById("password").value;
    var password = document.getElementById("passwordUName").value
    if (editedPass.lenght < 3) {
        alert("Password troppo corta")
    } else {
        if (password == users[index].password) {
            users[index].password = editedPass;
            window.localStorage.setItem("userList", JSON.stringify(users));
            window.location.href = "profile.html";
        } else {
            alert("password errata");
        }
    }
}

function deleteProfile() {
    console.log(index)
    var albumList = JSON.parse(window.localStorage.getItem('albumList'))
    var trades = JSON.parse(window.localStorage.getItem('trades'))

    users[index].email = ""
    users[index].password = ""
    users[index].username = ""

    //rimuovo i trade messi dall'utente
    for (var i = 0; i < trades.length; i++) {
        //Cancello la mia richiesta di scambio se nessuno mi ha proposto una carta
        if (parseInt(trades[i].from) == index && trades[i].idTradeTo == "") {
            console.log('Cancello la mia richiesta di scambio se nessuno mi ha proposto una carta')
            trades.splice(i, 1)
            //Cancello la mia richiesta di scambio e restituisco la carta proposta
        } else if (parseInt(trades[i].from) == index && trades[i].idTradeTo != "") {
            console.log('Cancello la mia richiesta di scambio e restituisco la carta proposta')
            var otherUser = trades[i].to
            var otherUserAlbum = albumList[otherUser].cards
            otherUserAlbum.push(trades[i].idTradeTo)
            console.log(otherUserAlbum)
            trades.splice(i, 1)
            //Cancello la mia proposta di scambio
        } else if (parseInt(trades[i].to) == index) {
            console.log('Cancello la mia proposta di scambio')
            trades[i].idTradeTo = ""
            trades[i].to = ""
        }
    }
    console.log(trades)
    window.localStorage.setItem('userList', JSON.stringify(users))
    window.localStorage.setItem('albumList', JSON.stringify(albumList))
    window.localStorage.setItem('trades', JSON.stringify(trades))
    alert('Il tuo profilo è stato cancellato con successo')
    window.location.href = "/../index.html"
}



