import {
	elements,
	renderLoader,
	clearLoader,
	getLikeImage,
} from './views/base.js';
import Activity from './modules/Activity.js';
import AppActivity from './modules/AppActivity.js';
import Like from './modules/Likes.js';
import * as activityView from './views/activityView.js';
import * as likesView from './views/likesView.js';
import './styles.css';
// Todo:
// - Compress images correctly
// - Make it so you display as liked if user id that liked is the same (having the liked activities on the cloud)

const state = {};

// ****** API LOGIC ******

// *** ACTIVITY CONTROLLER ***
const controlActivity = async (id, contribution = undefined) => {
	// 1) Get existing id or generate random one
	const key = parseInt(id, 10);
	if (key) {
		state.act = new Activity(key, contribution);
	} else {
		state.act = new Activity('', contribution);
	}

	// 2) Prepare UI
	activityView.clearActivity();
	clearLoader(elements.main);
	renderLoader(elements.main);
	try {
		// 3) Fetch API data
		await state.act.getResults();
		if (state.act.title != undefined) {
			// 4) Render data
			const user = firebase.auth().currentUser;
			const userData = db.collection('users').doc(user.uid);
			userData.get().then((doc) => {
			const liked = state.like ? doc.data().likes.includes(state.act.key) || state.like.isLiked(state.act.key) : false
			clearLoader(elements.main);
			activityView.renderActivity(state.act, liked);
		})
		} else {
			clearLoader(elements.main);
			activityView.renderActivity(undefined, false);
			console.error('ERROR: Activiy not found, try again');
			// Remove like from the state
			state.act.liked = state.like.deleteLike(key);
			// Remove like from UI list
			likesView.deleteListItem(key);
		}
	} catch (err) {
		console.error(err);
	}
};
// *** APP CONTROLLER ***
const controlApp = async (likeType) =>{
	if (state.app.key) {
		try {
			await state.app.updateLike(likeType);
		} catch (err) {
			console.log(err);
		}
	} else {
		console.log('Key not found');
	}
}


// *** LIKES CONTROLLER ***
const controlLike = async () => {
	const user = firebase.auth().currentUser;
	activityView.clearActivity();
	clearLoader(elements.main);
	renderLoader(elements.main);
	if (user) {
		if (!state.like) {
			state.like = new Like();
		}
						// User HAS liked current recipe
				if ( state.like.isLiked(state.act.key)) {


					// Remove like from the state
					state.act.liked = state.like.deleteLike(state.act.key);
					// Remove like from UI list
					likesView.deleteListItem(state.act.key);

				}
				// User HAS NOT liked current recipe
				else {
					// Add like to the state
					state.act.liked = state.like.addLike(
						state.act.key,
						state.act.title,
						state.act.type
					);
					// Add like to UI list
					likesView.renderListItem(state.act);
				}
		// Add user information
		const userData = db.collection('users').doc(user.uid)
		userData.get().then(function(doc) {
			if (doc.exists) {
				let cloudData = {likes: doc.data().likes}
				state.act.liked = cloudData.likes.includes(state.act.key)
				if (state.act.liked){
					// Update user likes
					const index = cloudData.likes.findIndex(el => el === state.act.key);
					cloudData.likes.splice(index, 1);

					// Update on app
					controlApp(false)
					
					state.act.liked = false;
				} else {
					// Update user likes
					cloudData.likes.push(state.act.key)

					// Update app
					controlApp(true)

					state.act.liked = true;
				}
				userData.set(cloudData)
			} else {
				userData.set({
					likes: [state.act.key]
				})
			}

		// Toggle the like button
		activityView.clearActivity();
		clearLoader(elements.main);
		activityView.renderActivity(state.act, state.act.liked);
		}).catch(function(error) {
			console.log("Error al buscar documento:", error);
		});
	} else {
		activityView.clearActivity();
		clearLoader(elements.main);
		activityView.renderActivity(undefined, true);
	}
};

// ****** APP FIRBASE LOGIC ******

// *** AUTHENTICATION ***
const auth = firebase.default.auth();

const provider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged((user) => {
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

auth.onAuthStateChanged((user) => {
	if (user) {
		actsRef = db.collection('activities');
		elements.createAct.onclick = () => {
			if (elements.newAct.elements.name.value != false) {
				const actAdd = {
					key: 1000001 + counter,
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
				actsRef.doc(`${actAdd.key}`).set(actAdd);
				// Add like to the state
				state.act.liked = state.like.addLike(
					actAdd.key,
					actAdd.title,
					actAdd.type
				);
				// Add like to UI list
				likesView.renderListItem(state.act);
				for (let i = 0; i < elements.newAct.elements.length; i++) {
					elements.newAct.elements[i].value = '';
				}
			}
		};
		// Query
		unsubscribe = actsRef
			.orderBy('createdAt') // Requires a query
			.onSnapshot((querySnapshot) => {
				counter = querySnapshot.docs.length;
				// Map results to an array of li elements
				const items = querySnapshot.docs.map((doc) => {
					return `<li id="like-${
						doc.data().key
					}"class="list-decimal list-inside flex flex-row items-center m-4 border-primary-200 p-4 border-4 rounded-lg bg-primary-300 text-white"><h4 class="mx-2 text-base"><a href="#${
						doc.data().key
					}" class="font-bold cursor-pointer">${
						doc.data().title
					}</a> - agregada por <span class="italic">${
						doc.data().uname
					}</span></h4><div class="flex flex-col md:flex-row border-primary-200 border-2 rounded-md p-2 bg-primary-300 mx-3 my-0 cursor-pointer ml-auto" >
					<h4 class="text-3xl mx-2">${doc.data().liked}</h4>
					<img class="button hover:scale-110 mx-2" src="${getLikeImage(
						true
					)}" alt="" srcset=""></img>
				</div></li>`;
				});
				elements.actsList.innerHTML = items.join('');
			});
	} else {
		// Unsubscribe when the user signs out
		state.app = null;
		unsubscribe && unsubscribe();
	}
});

// *** EVENT HANDLING ***
/// Sign in event handlers
elements.signInBtn.onclick = () => auth.signInWithPopup(provider);
elements.signOutBtn.onclick = () => auth.signOut();

elements.nav.addEventListener('click', (e) => {
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
elements.body.addEventListener('click', (e) => {
	// Toggle like button

	if (e.target.matches('#like, #like *')) {
		controlLike();
		// Generate new activity
	} else if (
		e.target.matches('#generate, #generate *') ||
		e.target.matches('#createAct, #createAct *')
	) {
		controlActivity();
		if (elements.activitySection.classList.contains('hidden')) {
			elements.activitySection.classList.remove('hidden');
		}
	}
});

// Check for inputted activity
window.addEventListener('hashchange', async function () {
	const id = window.location.hash.replace('#', '');
	state.app = new AppActivity(id);
	if (id >= 1000000 && id <= 9999999) {
		try {
			const call = await state.app.getData(id);
			if (call) {
				controlActivity(id, state.app.data);
			} else {
				controlActivity(id);
			}
		} catch (err) {
			console.log('Something went wrong');
			console.error(err);
		}
		if (elements.activitySection.classList.contains('hidden')) {
			elements.activitySection.classList.remove('hidden');
		}
	}
});

// Restore liked recipes on page load
window.addEventListener('load', () => {
	state.like = new Like();
	window.location.hash = '';
	// Restore likes
	state.like.readStorage();

	// Render the existing likes
	state.like.likes.forEach((like) => likesView.renderListItem(like));
});
