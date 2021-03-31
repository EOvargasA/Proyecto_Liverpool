/**
 * @param String name
 * @return String
 */
 function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function inicializarSidebar(){
    var espacio = document.getElementById("sidebarBody");
    var lista = document.createElement("ul");
    var li;

    getAllProyects().then((proyectos) => {
        proyectos.forEach((project) => {
            li = crearProyectoSide(project);
            lista.appendChild(li);
        });
        var sesion = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("onclick", "cerrarSesion();");
        a.innerHTML = 'Cerrar Sesion';
        sesion.appendChild(a);
        lista.appendChild(sesion);
        espacio.appendChild(lista);
    });
}

function crearProyectoSide(project){
    var regreso = document.createElement("li");
    var padre = document.createElement("div");
    padre.setAttribute("class", "linea");
    padre.setAttribute("onclick", "toggleOpciones('"+project.id+"');");

    var titulo = document.createElement("a");
    titulo.setAttribute('href', '#');
    titulo.innerHTML = project.data().Nombre;

    var opciones = crearOprionesProjecto(project.id);
    isAdmin(project, opciones);

    padre.appendChild(titulo);
    regreso.appendChild(padre);
    regreso.appendChild(opciones);
    return regreso;
}

function crearOprionesProjecto(id) {
    var padre = document.createElement("ul");
    padre.setAttribute("id", "opciones"+id);

    hijo = document.createElement("li");
    a = document.createElement("a");
    a.setAttribute("href", "anuncio.html?projectID="+id);
    a.innerHTML = "Anuncios";
    hijo.appendChild(a);
    padre.appendChild(hijo);

    hijo = document.createElement("li");
    a = document.createElement("a");
    a.setAttribute("href", "reuniones.html?projectID="+id);
    a.innerHTML = "Reuniones";
    hijo.appendChild(a);
    padre.appendChild(hijo);

    hijo = document.createElement("li");
    a = document.createElement("a");
    a.setAttribute("href", "objetivos.html?projectID="+id);
    a.innerHTML = "Objetivos";
    hijo.appendChild(a);
    padre.appendChild(hijo);

    return padre;
}

function crearOprionesMainbarProjecto(id) {
    var padre = document.createElement("ul");
    padre.setAttribute("id", "main"+id);
    var hijo, a;

    hijo = document.createElement("li");
    a = document.createElement("a");
    a.setAttribute("href", "anuncio.html?projectID="+id);
    a.innerHTML = "Anuncios";
    hijo.appendChild(a);
    padre.appendChild(hijo);

    hijo = document.createElement("li");
    a = document.createElement("a");
    a.setAttribute("href", "reuniones.html?projectID="+id);
    a.innerHTML = "Reuniones";
    hijo.appendChild(a);
    padre.appendChild(hijo);

    hijo = document.createElement("li");
    a = document.createElement("a");
    a.setAttribute("href", "objetivos.html?projectID="+id);
    a.innerHTML = "Objetivos";
    hijo.appendChild(a);
    padre.appendChild(hijo);

    /*hijo = document.createElement("li");
    a = document.createElement("a");
    a.setAttribute("href", "empleados.html?projectID="+id);
    a.innerHTML = "Administrar";
    hijo.appendChild(a);
    padre.appendChild(hijo);*/

    return padre;
}

function inicializarMainbar(){
    var espacio = document.getElementById("titulocompleto");
    var lista = document.getElementById("listaPC");
    var opciones;

    if(typeof espacio !== undefined){
        var id = getParameterByName("projectID");
        getProyectByID(id).then((doc) => {
            espacio.innerHTML = doc.data().Nombre;
            opciones = crearOprionesMainbarProjecto(doc.id);
            isAdminID(id, opciones);
            lista.innerHTML = ""
            lista.appendChild(opciones);
        });
    }
}

function ocultarSideBar(){
    document.getElementById('sidebar').style.width = "0%";
}

function abrirSideBar(){
    document.getElementById('sidebar').style.width = "70%";
}

function toggleOpciones(id){
    var id = "opciones"+id;
    if(document.getElementById(id).style.maxHeight == "1000px"){
        document.getElementById(id).style.maxHeight = "0px";
    }else{
        document.getElementById(id).style.maxHeight = "1000px";
    }
}

function cerrarSesion(){
    signOut().then(() => {
        location="sesion.html";
    });
}

function isAdmin(proyect, padre){
    var hijo, a;

    getUserAuthenticated(uid).then((users) => {
        users.forEach((user) => {
            if(proyect.data().Admin == user.id){
                hijo = document.createElement("li");
                a = document.createElement("a");
                a.setAttribute("href", "empleados.html?projectID="+proyect.id);
                a.innerHTML = "Administrar";
                hijo.appendChild(a);
                padre.appendChild(hijo);
            }
        });
    });
}

function isAdminID(id, padre){
    var hijo, a;
    
    getProyectByID(id).then((proyect) => {
        getUserAuthenticated(uid).then((users) => {
            users.forEach((user) => {
                if(proyect.data().Admin == user.id){
                    hijo = document.createElement("li");
                    a = document.createElement("a");
                    a.setAttribute("href", "empleados.html?projectID="+proyect.id);
                    a.innerHTML = "Administrar";
                    hijo.appendChild(a);
                    padre.appendChild(hijo);
                }
            });
        });
    });
}