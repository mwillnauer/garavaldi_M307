// Anmeldeformular mit HTML DOM
// Validierung E-Mail-Feld
let validationFields = {
    "name_felder": false,
    "lastname_felder": false,
    "address_felder": false,
    "email_felder": false,
    "plz_felder": false
};


//Funktion zur Email Validierung HTML DOM BEISPIEL
function emailValidierung() {
    let email = document.getElementById("email_felder").value; //Inhalt auslesen
    // Unten steht der Regex für Email format --> gelernt bei einem Stack Overflow (kopiert von Website)
    let format = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (format.test(email)) { //Auf Regex überprüfen
        document.getElementById("email_felder").classList.add('is-valid'); //is-valid klasse hinzufügen (ist valid)
        document.getElementById("email_felder").classList.remove('is-invalid');//is-invalid klasse entfernen
        validationFields["email_felder"] = true;
    } else {
        document.getElementById("email_felder").classList.add('is-invalid');//is-invalid klasse hinzufügen (ist invalid)
        document.getElementById("email_felder").classList.remove('is-valid');//is-valid klasse entfernen
        validationFields["email_felder"] = false;
    }
    submitButton();
}

//Funktion zur Text Validierung; Falls kein Text vorhanen = valid, sonst invalid
function textValidierung(klasse) { //ALLES DOM MANIPULATIONEN --> ALLES WAS document.getElementById
    let content = document.getElementById(klasse).value;
    if (content.length > 0) {
        document.getElementById(klasse).classList.add('is-valid');
        document.getElementById(klasse).classList.remove('is-invalid');
        validationFields[klasse] = true;
    } else {
        document.getElementById(klasse).classList.add('is-invalid');
        document.getElementById(klasse).classList.remove('is-valid');
        validationFields[klasse] = false;
    }
    submitButton();
}

//Funktion PLZ Validierung
function numberValidierung(klasse) {
    let content = document.getElementById(klasse).value;
    if (content.length == 4) {
        document.getElementById(klasse).classList.add('is-valid');
        document.getElementById(klasse).classList.remove('is-invalid');
        validationFields[klasse] = true;
    } else {
        document.getElementById(klasse).classList.add('is-invalid');
        document.getElementById(klasse).classList.remove('is-valid');
        validationFields[klasse] = false;
    }
    submitButton();
}

function submitButton() {
    let counter = countValidation()
    if (counter == 5) {
        document.getElementById("submitButton").removeAttribute("disabled");//https://www.w3schools.com/jsref/met_element_removeattribute.asp
    } else {
        console.log("no")
        document.getElementById("submitButton").setAttribute("disabled", "");//https://www.w3schools.com/jsref/met_element_removeattribute.asp

    }
}

function renderMusicianList(response) {
    let musicians = "";
    let htmlObj = document.getElementById("saenger");
    for (let i = 0; i < response.length; i++) {
        musicians += '<div class="artist">' + response[i].name + '<br>' + response[i].date + '<br>' + response[i].place + '<br>' + response[i].genre + '<br>' + response[i].price + '</div>' //GEKAPSELTE DATEN --> OBJEKT LITERAL = {musician}// .name --> erste Eigenschaft, erste Proberty
    }
    htmlObj.innerHTML = musicians;

}

function renderDropdown(response) {
    let option = "";
    //Daten in Dropdown laden ()
    for (let i = 0; i < response.length; i++) {
        option += '<option value="' + response[i].name + '">' + response[i].name + "</option>"
    }
    document.getElementById('konzerte_select').innerHTML = option;

}


function saveParticipant() {
    let concert = document.getElementById("konzerte_select").value; //Inhalt auslesen
    let name = document.getElementById("name_felder").value; //Inhalt auslesen
    let lastname = document.getElementById("lastname_felder").value; //Inhalt auslesen
    let address = document.getElementById("address_felder").value; //Inhalt auslesen
    let plz = document.getElementById("plz_felder").value; //Inhalt auslesen
    let email = document.getElementById("email_felder").value; //Inhalt auslesen

    return new Promise(function (resolve, reject) {
        fetch('http://127.0.0.1:5000/add_participant', {
            method: 'POST',
            body: JSON.stringify({
                "concert": concert,
                "prename": name,
                "surname": lastname,
                "adress": address,
                "plz": plz,
                "email": email
            }),
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then((response) => {
                let result = response.json();
                resolve(result)
                throw new Error(response.statusText);
            }, (error) => {
                reject(error)
            }
        ).catch((error) => {
            if (error == "Error: FORBIDDEN") {
                alert("Fehler bei der Validierung")
                reject(error)
            } else if (error == "Error: Not Found") {
                alert("Es konnte keine Verbindung zum Server aufgebaut werden")
                reject(error)
            }
        })
    });
}

function getMusicians() {
    return new Promise(function (resolve, reject) {
        fetch('http://127.0.0.1:5000/get_all_concerts').then((response) => {
                let result = response.json();
                resolve(result)
                throw new Error(response.statusText);
            }, (error) => {
                reject(error)
            }
        ).catch((error) => {
            if (error == "Error: Not Found") {
                alert("Es konnte keine Verbindung zum Server aufgebaut werden")
                reject(error)
            }
        })
    });
}

async function loadMusicians(type) {
    try {
        if (type == "list") {
            let result = await getMusicians();
            renderMusicianList(result);
        } else if (type == "dropdown") {
            let result = await getMusicians();
            renderDropdown(result);
        }
    } catch (error) {
        console.log(error);
    }
}


async function buyTicket() {
    let counter = countValidation()
    if (counter == 5) {
        try {
            let result = await saveParticipant();
            window.location.replace("./bestaetigung.html");
        } catch (error) {
            console.log(error);
        }
    }
}

function countValidation() {
    let counter = 0;
    for (let k in validationFields) {
        if (validationFields[k] === true) {
            counter += 1;
        }
    }
    return counter
}