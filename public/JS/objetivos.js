var uid;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        uid = user.uid;
        cargarActividades();
    }else{
        location="sesion.html";
    }
});

function cargarActividades(){
    projectID = getParameterByName("projectID");
    contenedor = document.getElementById("tareas");
    yoName = document.getElementById("yoName");

    getUserAuthenticated(uid).then((users) => {
        users.forEach((e) => {
            var userID = e.id;
            yoName.innerHTML = e.data().Name;

            getTasksProyect(projectID, userID).then((tareas) => {
                tareas.forEach((tarea) => {
                    tarea.data().Actividades.forEach((actividad) => {
                        contenedor.appendChild(ponerActividad(actividad));
                    });
                });
            });

        });
    });
    
}

function ponerActividad(actividad){
    var li = document.createElement("li");
    li.innerHTML = actividad;
    return li;
}

inicializarMainbar();
inicializarSidebar();