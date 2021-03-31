// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

firebase.initializeApp({
    apiKey: "AIzaSyA7WdS089Pe1QBevv19FaQZL08zWnxRbe8",
    authDomain: "proyectoliverpool-9ae4a.firebaseapp.com",
    databaseURL: "https://proyectoliverpool-9ae4a.firebaseio.com",
    projectId: "proyectoliverpool-9ae4a",
    storageBucket: "proyectoliverpool-9ae4a.appspot.com",
    messagingSenderId: "55893763112",
    appId: "1:55893763112:web:849ca322ee5fdc585a411d",
    measurementId: "G-GNE8GWLQZG"
});


//const vapidKey = "BOIRUwv5TLRFknTGJyzB-G4VWIMbnwE26bcwsw7fTWuWE035bZ5IkQeoFwhmnVzo4yLhoI0jtk1BRfjXgoCG0Fg";

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'imagenes/firebase_logo.png'
  };

  /*self.registration.showNotification(notificationTitle,
        notificationOptions);*/
});