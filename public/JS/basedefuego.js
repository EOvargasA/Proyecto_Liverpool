// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
var firebaseConfig = {
    apiKey: "AIzaSyA7WdS089Pe1QBevv19FaQZL08zWnxRbe8",
    authDomain: "proyectoliverpool-9ae4a.firebaseapp.com",
    databaseURL: "https://proyectoliverpool-9ae4a.firebaseio.com",
    projectId: "proyectoliverpool-9ae4a",
    storageBucket: "proyectoliverpool-9ae4a.appspot.com",
    messagingSenderId: "55893763112",
    appId: "1:55893763112:web:849ca322ee5fdc585a411d",
    measurementId: "G-GNE8GWLQZG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();
var messaging = firebase.messaging();

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function signIn (email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

function signOut(){
    return firebase.auth().signOut();
}

function getAllProyects(){
    return db.collection("proyectos").get();
}

function getProyectByID(id){
    return db.collection("proyectos").doc(id).get();
}

function getProyectPosts(id){
    return db.collection("proyectos").doc(id).collection("posts").get();
}

function getProyectPostComments(ProyectID, PostID){
    return db.collection("proyectos").doc(ProyectID).collection("posts").doc(PostID).collection("Comentarios").get();
}

function getUserFromID(id){
    return db.collection("usuarios").doc(id).get();
}

function getUserAuthenticated(uid){
    return db.collection("usuarios").where("Autenticacion", "==", uid).get();
}

function getProyectReunions(id) {
    return db.collection("proyectos").doc(id).collection("reuniones").get();
}

function getTasksProyect(proyectID, userID){
    return db.collection("acrtividades").where("Proyecto", "==", proyectID).where("Usuario", "==", userID).get();
}

function createProyectPost(id, json){
    return db.collection("proyectos").doc(id).collection("posts").add(json);
}

function createProyectPostComment(ProyectID, PostID, json){
    return db.collection("proyectos").doc(ProyectID).collection("posts").doc(PostID).collection("Comentarios").add(json);
}

function createProyectReunion(id, json){
    return db.collection("proyectos").doc(id).collection("reuniones").add(json);
}

function updateTasksProyect(id, json){
    return db.collection("acrtividades").doc(id).update(json);
}

function deleteProyectPost(ProyectID, PostID){
    return db.collection("acrtividades").doc(ProyectID).collection("posts").doc(PostID).delete();
}

function messagingInit(){
    messaging
        .requestPermission()
        .then(() => {
            console.log("Notification Permission");
            return messaging.getToken({ vapidKey: 
                "BOIRUwv5TLRFknTGJyzB-G4VWIMbnwE26bcwsw7fTWuWE035bZ5IkQeoFwhmnVzo4yLhoI0jtk1BRfjXgoCG0Fg" });
        }).then((token) => {
            console.log("Token: "+token);
            proyectID = getParameterByName("projectID");
            if(proyectID != ""){
                getProyectByID(proyectID).then((project) => {
                    subscribeTokenToTopic(token, project.data().Nombre);
                });
            }
        }).catch((e) => {
            console.log(e);
        });
}

function subscribeTokenToTopic(token, topic) {
    fetch('https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/'+topic, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'key=AAAADQOHJCg:APA91bFQqUdbyBC0ZWVXgUIuQVoLpUf3e22pxEc1kqKXammi-eHVsXejio37c-H-rtSOlDsxLePKtZbYgU4Ib0u0Al1wnpjwUwcRqbilby6YLF4n2sO99WOyJni6o8Hu5ikAJZAQSHyN'
      })
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
      }
      console.log('Subscribed to "'+topic+'"');
    }).catch(error => {
      console.error(error);
    })
}

/*function sendMessage() {
    fetch("https://cors-proxy.htmldriven.com/?url=https://fcm.googleapis.com/iid/v1/projects/proyectoliverpool-9ae4a/messages:send", {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ya29.a0AfH6SMDyq1gbnu_KDCgNVxTD0jrBa_ffzVQvlLm7N1rcj78L_jKLwWRENPDDNmQZ88Hc3cPKjxkeUckcWeKCxOVUsqVF_jrAVdAxpbCYe_uqsB0uOA9YfrBO0Vr61-B0CZMwPGMxDFWkhZN4EyIp2gNAWBhB',
            'Content-Type': 'application/json'
        }), body: {
            "message": {
                "topic": "Proyecto1",
                "notification": {
                    "title": "Proyecto1",
                    "body": "Nuevo post"
                },
                "webpush": {
                    "fcm_options": {
                        "link": "https://dummypage.com"
                    }
                }
            }
        }
    }).then(response => {
        if (response.status < 200 || response.status >= 400) {
            throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
        }
        console.log('Mensaje enviado con exito');
    }).catch(error => {
        console.error(error);
    })
}*/

messaging.onMessage((payload) => {
    console.log(payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'imagenes/firebase_logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});

messaging.onTokenRefresh((token) => {
    messaging.getToken().then((token) =>{
        console.log("New Token: "+token);
    }).catch((e) => {
        console.log(e);
    });
});

messagingInit();

//sendMessage();