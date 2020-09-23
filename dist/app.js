console.log(firebase)

// *** AUTHENTICATION ***
const auth = firebase.default.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers
signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hola ${user.displayName}!</h3> <p>ID de Usuario: ${user.uid}</p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

// *** FIRESTORE DATABASE ***
const db = firebase.firestore()

const createAct = document.getElementById('createAct');
const actsList = document.getElementById('actsList');
const newAct = document.getElementById('newAct');

let actsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {
        actsRef = db.collection('activities');
        createAct.onclick = () => {
            console.log('It worked')
            actsRef.add({
                uid: user.uid,
                name: newAct.value,
                createdAt: Date.now()
                // serverTimestamp()
            });
        }
    }

});