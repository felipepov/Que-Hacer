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
        userDetails.innerHTML = `<h3>Hola <span class=" font-bold"> ${user.displayName}</span>!</h3> <p>ID de Usuario: <span class=" font-bold">${user.uid}</span></p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

// *** FIRESTORE DATABASE ***
const db = firebase.firestore();

const createAct = document.getElementById('createAct');
const actsList = document.getElementById('actsList');
const newAct = document.getElementById('newAct');

let actsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {
        actsRef = db.collection('activities');
        // actsRef.get().then(snap => {
        //     size = snap.size
        //     return size
        //  });
        const actArr = [];
        createAct.onclick = () => {
            if (newAct.elements.name.value != false) {
                const actAdd = {
                    uid: user.uid,
                    id: 1000001 + actArr.length,
                    name: newAct.elements.name.value,
                    type: newAct.elements.type.value,
                    participants: newAct.elements.participants.value,
                    price: newAct.elements.price.value / 10,
                    accesibility: newAct.elements.accesibility.value / 10,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                actArr.push(actAdd);
                actsRef.add(actAdd);
                for (let i = 0; i < newAct.elements.length; i++) {
                    newAct.elements[i].value = '';
                }
            }
        }
            // Query
            unsubscribe = actsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt') // Requires a query
            .onSnapshot(querySnapshot => {
                
                // Map results to an array of li elements
                const items = querySnapshot.docs.map(doc => {
                    return `<li class="list-decimal list-inside m-4"><h4 class="inline-block">${doc.data().name}</h4></li>`
                });

                actsList.innerHTML = items.join('');

            });

    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }

});