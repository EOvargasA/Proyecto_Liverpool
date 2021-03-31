var uid;

function cargarPosts(){
    var id = getParameterByName("projectID");
    var contenedor = document.getElementById("contenedorNoticias");

    getProyectPosts(id).then((posts) => {
        posts.forEach((post) => {
            contenedor.appendChild(crearPost(post));
            actualizarPostUsuario(post);
            cargarComentarios(id, post.id);
        });
    });
}

function crearPost(post){
    var padre, contenedorNoticia, p;

    var padre = document.createElement("div");
    padre.setAttribute("class", "noticia");

    var contenedorNoticia = document.createElement("div");
    contenedorNoticia.setAttribute("class", "original");

    var p = document.createElement("p");
    p.setAttribute("class", "nombre");
    p.setAttribute("id", "postID"+post.id+"autorID"+post.data().Autor);
    p.innerHTML = post.data().Autor;
    contenedorNoticia.appendChild(p);

    var p = document.createElement("p");
    p.setAttribute("class", "titulo");
    p.innerHTML = post.data().Titulo;
    contenedorNoticia.appendChild(p);

    var p = document.createElement("p");
    p.setAttribute("class", "contenido");
    p.innerHTML = post.data().Texto;
    contenedorNoticia.appendChild(p);

    padre.appendChild(contenedorNoticia);
    contenedorNoticia = document.createElement("div");
    contenedorNoticia.setAttribute("id", "comments"+post.id);
    padre.appendChild(contenedorNoticia);
    return padre;
}

function actualizarPostUsuario(post){
    var campo = document.getElementById("postID"+post.id+"autorID"+post.data().Autor);
    getUserFromID(post.data().Autor).then((autor) => {
        campo.innerHTML = autor.data().Name;
    });
}

function cargarComentarios(projectID, postID) {
    var caja = document.getElementById("comments"+postID);

    getProyectPostComments(projectID, postID).then((comentarios) => {
        comentarios.forEach((comentario) => {
            caja.appendChild(crearComentario(comentario));
            actualizarComentarioUsuario(comentario);
        });
        caja.appendChild(crearNuevosCommentarios(postID));
    });
}

function crearComentario(data) {
    var base = document.createElement("div");
    base.setAttribute("class", "comentario");

    var p = document.createElement("p");
    p.setAttribute("class", "nombre");
    p.setAttribute("id", "commentID"+data.id);
    p.innerHTML = data.data().Autor;
    base.appendChild(p);

    var p = document.createElement("p");
    p.setAttribute("class", "contenido");
    p.innerHTML = data.data().Texto;
    base.appendChild(p);

    return base;
}

function actualizarComentarioUsuario(data){
    var campo = document.getElementById("commentID"+data.id);
    getUserFromID(data.data().Autor).then((autor) => {
        campo.innerHTML = autor.data().Name;
    });
}

function crearNuevosCommentarios(id){
    var formulario = document.createElement("div");
    formulario.setAttribute("class", "newComment");
    var forma = document.createElement("form");
    forma.setAttribute("onsubmit", "return postearComentario('"+id+"')")
    
    var campo = document.createElement("input");
    campo.setAttribute("type", "text");
    campo.setAttribute("placeholder", "comentario");
    campo.setAttribute("class", "texto");
    campo.setAttribute("id", "texto"+id);
    forma.appendChild(campo);

    var campo = document.createElement("input");
    campo.setAttribute("type", "submit");
    campo.setAttribute("value", "Comentar");
    campo.setAttribute("class", "respuesta");
    forma.appendChild(campo);

    formulario.appendChild(forma);
    return formulario;
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        uid = user.uid;
    }else{
        location="sesion.html";
    }
});

inicializarMainbar();
inicializarSidebar();
cargarPosts();

function postearFormulario(){
    var titulo = document.getElementById("titulo").value;
    var texto = document.getElementById("texto").value;
    
    if(titulo == null || titulo == "" || texto ==null || texto == "") {
        alert("Llene todos los campos");
        return (false);
    }

    var id = getParameterByName("projectID");

    getUserAuthenticated(uid).then((users) => {
        users.forEach((e) => {
            var user = e.id;
            
            var json = {
                Autor: user,
                Texto: texto,
                Titulo: titulo
            }
            
            createProyectPost(id, json).then((docRef) => {
                location.reload();
            });
        });
    });

    return (false);
}

function postearComentario(postID){
    var texto = document.getElementById("texto"+postID).value;
    var proyectID = getParameterByName("projectID");
    
    if(texto ==null || texto == "") {
        alert("Llene todos los campos");
        return (false);
    }
    
    getUserAuthenticated(uid).then((users) => {
        users.forEach((e) => {
            var user = e.id;
            
            var json = {
                Autor: user,
                Texto: texto
            }
        
            createProyectPostComment(proyectID, postID, json).then((docRef) => {
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