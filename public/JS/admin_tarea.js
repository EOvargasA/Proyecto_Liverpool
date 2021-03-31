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
    userID = getParameterByName("userID");
    contenedor = document.getElementById("tareas");

    getTasksProyect(projectID, userID).then((tareas) => {
        tareas.forEach((tarea) => {
            lista = tarea.data().Actividades;
            for (var i = 0; i < lista.length; i++){
                contenedor.appendChild(ponerActividad(lista[i], i));
            }
        });
    });
    
}

function cargarUsuario() {
    var userID = getParameterByName("userID");
    var canvas = document.getElementById("empleadoActual");

    getUserFromID(userID).then((user) => {
        canvas.innerHTML = user.data().Name;
    });
}

function ponerActividad(actividad, index){
    var li = document.createElement("li");
    var texto = actividad+"<br><a href='#' onclick='borrarActividad("+
    index+");'>Eliminar</a>";
    li.innerHTML = texto;
    return li;
}

function nuevaActividad(){
    var tarea = document.getElementById("tarea").value;
    
    if(tarea == null || tarea == "") {
        alert("Llene todos los campos");
        return (false);
    }
    var user = getParameterByName("userID");
    var id = getParameterByName("projectID");

    getTasksProyect(id, user).then((tareas) => {
        tareas.forEach((e) => {
            var actividades = e.data().Actividades;
            actividades.push(tarea);

            var json = {
                Actividades: actividades
            }

            updateTasksProyect(e.id, json).then((docRef) => {
                location.reload();
            });
        });
    });
    
    /*var json = {
        Autor: user,
        Texto: texto,
        Titulo: titulo
    }
    
    createProyectPost(id, json).then((docRef) => {
        location.reload();
    });*/

    return (false);
}

function borrarActividad(index){
    var user = getParameterByName("userID");
    var id = getParameterByName("projectID");

    getTasksProyect(id, user).then((tareas) => {
        tareas.forEach((e) => {
            var actividades = e.data().Actividades;
            moveToLast(actividades, index);
            actividades.pop();

            var json = {
                Actividades: actividades
            }

            updateTasksProyect(e.id, json).then((docRef) => {
                location.reload();
            });
        });
    });
}

function moveToLast(array, index){
    temp = array[index];
    array[index] = array[array.length - 1];
    array[array.length - 1] = temp;
}

inicializarMainbar();
inicializarSidebar();
cargarActividades();
cargarUsuario();