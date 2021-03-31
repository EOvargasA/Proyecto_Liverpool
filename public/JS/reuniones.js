var mapa, marcador, uid;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        uid = user.uid;
    }else{
        location="sesion.html";
    }
});

function cargarReuniones(){
    var id = getParameterByName("projectID");
    var contenedor = document.getElementById("contenedorReuniones");

    getProyectReunions(id).then((reunions) => {
        reunions.forEach((reunion) => {
            contenedor.appendChild(crearReunion(reunion));
            activarMapa(reunion);
            actualizarReunionUsuario(reunion);
        });
    });
}

function crearReunion(data){
    var padre, contenedorNoticia, p;

    var padre = document.createElement("div");
    padre.setAttribute("class", "noticia");

    var contenedorNoticia = document.createElement("div");
    contenedorNoticia.setAttribute("class", "original");

    var p = document.createElement("p");
    p.setAttribute("class", "nombre");
    p.setAttribute("id", "postID"+data.id);
    p.innerHTML = data.data().Autor;
    contenedorNoticia.appendChild(p);

    var p = document.createElement("p");
    p.setAttribute("class", "titulo");
    p.innerHTML = data.data().Titulo;
    contenedorNoticia.appendChild(p);

    var p = document.createElement("div");
    p.setAttribute("class", "mapaContenedor");
    p.setAttribute("id", "map"+data.id);
    contenedorNoticia.appendChild(p);

    var p = document.createElement("p");
    p.setAttribute("class", "contenido");
    p.innerHTML = "Link: "+data.data().Liga;
    contenedorNoticia.appendChild(p);

    var p = document.createElement("p");
    p.setAttribute("class", "fecha");
    p.innerHTML = traducirFecha(data.data().Fecha);
    contenedorNoticia.appendChild(p);

    padre.appendChild(contenedorNoticia);
    return padre;
}

function activarMapa(reunion){
    var lat = reunion.data().Local.latitude;
    var lng = reunion.data().Local.longitude;
    map = new google.maps.Map(document.getElementById("map"+reunion.id), {
        center: { lat: lat, lng: lng },
        zoomControl: false,
        rotateControl : false,
        draggable: false,
        zoom: 15
    });

    var marker1 = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        draggable: false
    });

    marker1.setMap(map);
}

function actualizarReunionUsuario(reunion){
    var campo = document.getElementById("postID"+reunion.id);
    getUserFromID(reunion.data().Autor).then((autor) => {
        campo.innerHTML = autor.data().Name;
    });
}

function traducirFecha(timestamp){
    f = timestamp.toDate();
    return f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
}

function initMap() {
    mapa = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15
    });

    marcador = new google.maps.Marker({
        position: {lat: -34.397, lng: 150.644},
        draggable: true
    });

    marcador.setMap(mapa);
}

function postearReunion(){
    var titulo = document.getElementById("titulo").value;
    var link = document.getElementById("link").value;
    var fecha = new Date(document.getElementById("fecha").value);


    if(titulo == null || titulo == "" || link ==null || link == "") {
        alert("Llene todos los campos");
        return (false);
    }

    if(fecha < new Date()){
        alert("Introdusca una fecha valida");
        return (false);
    }

    var latitude = marcador.getPosition().lat();
    var longitude = marcador.getPosition().lng();
    var punto = new firebase.firestore.GeoPoint(latitude, longitude);
    var id = getParameterByName("projectID");
    
    getUserAuthenticated(uid).then((users) => {
        users.forEach((e) => {
            var user = e.id;
            
            var json = {
                Autor: user,
                Fecha: fecha,
                Liga: link,
                Local: punto,
                Titulo: titulo
            }
        
            createProyectReunion(id, json).then((docRef) => {
                location.reload();
            });
        });
    });

    return (false);
}

function toggleFormulario(){
    var formulario = document.getElementById("formularioPosts");
    if(formulario.style.maxHeight == "1000px"){
        formulario.style.maxHeight = "0px";
    }else{
        formulario.style.maxHeight = "1000px";
    }
}

inicializarMainbar();
inicializarSidebar();
cargarReuniones();
