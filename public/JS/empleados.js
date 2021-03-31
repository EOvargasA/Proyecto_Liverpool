var uid;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        uid = user.uid;
        id = getParameterByName("projectID");

        getProyectByID(id).then((proyect) => {
            getUserAuthenticated(uid).then((users) => {
                users.forEach((user) => {
                    if(proyect.data().Admin != user.id){
                        location="objetivos.html?projectID="+id;
                    }
                });
            });
        });

    }else{
        location="sesion.html";
    }
});

function cargarActividades(){
    projectID = getParameterByName("projectID");
    contenedor = document.getElementById("usuarios");

    getProyectByID(projectID).then((proyecto) => {
        proyecto.data().Miembros.forEach((empleado) => {
            contenedor.appendChild(ponerEmpleado(empleado, projectID));
            actualizarEmpleado(empleado);
        });
    });
    
}

function ponerEmpleado(empleado, projectID){
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("href", "admin_tarea.html?projectID="+projectID+"&userID="+empleado);
    a.setAttribute("id", "empleado"+empleado);
    li.appendChild(a);
    return li;
}

function actualizarEmpleado(id){
    var campo = document.getElementById("empleado"+id);
    getUserFromID(id).then((empleado) => {
        campo.innerHTML = empleado.data().Name;
    });
}

inicializarMainbar();
inicializarSidebar();
cargarActividades();