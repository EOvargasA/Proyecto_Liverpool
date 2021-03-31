function iniciarSesion(){
    var nombre = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    
    if(nombre == null || nombre == "" || password ==null || password == "") {
        alert("Llene todos los campos");
        return (false);
    }
    
    signIn(nombre, password).then((user) => {
        location.reload();
    });

    return (false);
}

firebase.auth().onAuthStateChanged((user) => {
if (user) {
    location="index.html";
}
});