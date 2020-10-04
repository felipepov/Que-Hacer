import { elements, renderLoader, clearLoader } from './views/base.js';
import Activity from './modules/Activity.js';
import Like from './modules/Likes.js';
import * as activityView from './views/activityView.js';
import * as likesView from './views/likesView.js';
import "./styles.css"
// Todo:
// - Compress images correctly
// - If activity is contributed fetch from database instead of API
// - Update liked parameter on activity when liked by user
// - Add liked activity to database with 1 like but if already there update liked parameter
// - Make it so you display as liked if user id that liked is the same



const state = {};
state.api = true;



// ****** API LOGIC ******

// *** ACTIVITY CONTROLLER ***
const controlActivity = async (id, contribution = undefined) => {
	if (contribution != undefined) {
		state.api = false
	}
	// 1) Get existing id or generate random one
	if (state.api) {
		const key = parseInt(id, 10)
		if(key){
			state.act = new Activity(key);
		}	
		else {
			state.act = new Activity();
		}
	} else {
		state.act = new Activity(id, contribution)
	}

	// 2) Prepare UI
	activityView.clearActivity();
	clearLoader(elements.main);
	renderLoader(elements.main);
	try {
		// 3) Fetch API data
		await state.act.getResults();
		console.log(state.act)
		if (state.act.title != undefined) {
			// 4) Render data
			const liked = state.like ? state.like.isLiked(state.act.key) : false;
			clearLoader(elements.main);
			activityView.renderActivity(state.act, liked);
		} else {
			console.error('ERROR: Activiy not found, try again')
		}
	} catch (err) {
		console.error(err);
	}
};
// *** LIKES CONTROLLER ***
const controlLike = () =>{
	if (!state.like) {
	state.like = new Like();
	}
	// User HAS liked current recipe
	if (state.like.isLiked(state.act.key)) {
		// Remove like from the state
		state.act.liked = state.like.deleteLike(state.act.key);
		// Remove like from UI list
		likesView.deleteListItem(state.act.key)
	}
	// User HAS NOT liked current recipe
	else {
		// Add like to the state
		state.act.liked = state.like.addLike(state.act.key, state.act.title, state.act.type);
		// Add like to UI list
		likesView.renderListItem(state.act);
	}
	// Toggle the like button
	activityView.clearActivity();
	activityView.renderActivity(state.act, state.act.liked);
}


// ****** APP FIRBASE LOGIC ******

// *** AUTHENTICATION ***
const auth = firebase.default.auth();

const provider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        elements.whenSignedIn.hidden = false;
        elements.whenSignedOut.hidden = true;
        elements.userDetails.innerHTML = `<h3>Hola <span class=" font-bold"> ${user.displayName}</span>!</h3> <p>ID de Usuario: <span class=" font-bold">${user.uid}</span></p>`;
    } else {
        // not signed in
        elements.whenSignedIn.hidden = true;
        elements.whenSignedOut.hidden = false;
        elements.userDetails.innerHTML = '';
    }
});

// *** FIRESTORE DATABASE ***
const db = firebase.firestore();

let actsRef;
let unsubscribe;
let counter;

auth.onAuthStateChanged(user => {
    if (user) {
		actsRef = db.collection('activities');
        elements.createAct.onclick = () => {
            if (elements.newAct.elements.name.value != false) {
                const actAdd = {
					key: 10000001 + counter,
					uid: user.uid,
					uname: user.displayName,
                    title: elements.newAct.elements.name.value,
                    type: elements.newAct.elements.type.value,
                    people: elements.newAct.elements.participants.value,
                    price: elements.newAct.elements.price.value / 10,
					access: elements.newAct.elements.accesibility.value / 10,
					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
					link: '',
					liked: false,
				};

				// Integration with Client Side API logic
				controlActivity(actAdd.key, actAdd);

                // actsRef.add(actAdd); // Add to database, disable on devlopment, enable on production
                for (let i = 0; i < elements.newAct.elements.length; i++) {
                    elements.newAct.elements[i].value = '';
                }
            }
        }
            // Query
            unsubscribe = actsRef
            .orderBy('createdAt') // Requires a query
            .onSnapshot(querySnapshot => {  
				counter = querySnapshot.docs.length;
                // Map results to an array of li elements
                const items = querySnapshot.docs.map(doc => {
                    return `<li class="list-decimal list-inside m-4"><h4 class="inline-block"><a href="#${doc.data().key}" class="font-bold cursor-pointer">${doc.data().title}</a>- agregada por <span class="italic">${doc.data().uname}</span></h4></li>`
				});
                elements.actsList.innerHTML = items.join('');
			});

    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }

});




// *** EVENT HANDLING ***
/// Sign in event handlers
elements.signInBtn.onclick = () => auth.signInWithPopup(provider);
elements.signOutBtn.onclick = () => auth.signOut();



elements.nav.addEventListener('click', e => {
	if (e.target.matches('#likesBtn, #likesBtn *')) {
		// Handle Likes Button
		if (elements.likes.classList.contains('hidden')) {
			elements.likes.classList.remove('hidden');
		} else {
			elements.likes.classList.add('hidden');
		}
		// Handle Menu
	} else if (e.target.matches('#burger, #burger *')) {
		if (elements.menu.classList.contains('hidden')) {
			elements.menu.classList.remove('hidden');
		} else {
			elements.menu.classList.add('hidden');
		}
	}
});
elements.body.addEventListener('click', e => {
	// Toggle like button

	if (e.target.matches('#like, #like *')) {
		controlLike();
		// Generate new activity
	} else if (e.target.matches('#generate, #generate *' || e.target.matches('#createAct, #createAct *'))) {
		controlActivity();
		if (elements.activitySection.classList.contains('hidden')) {
			elements.activitySection.classList.remove('hidden');
		}
	}
});
	
// Check for inputted activity
window.addEventListener('hashchange', function(){
	if (state.act) {
		const id = window.location.hash.replace('#', '');
		if(id >= 1000000 && id <= 9999999) {
			controlActivity(id);
		}
	}
});

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.like = new Like();
    
    // Restore likes
    state.like.readStorage();

	// Render the existing likes
    state.like.likes.forEach(like => likesView.renderListItem(like));
});
