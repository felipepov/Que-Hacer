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
// - Filter actvities implmentations

const state = {};
const user = firebase.auth().currentUser;
const db = firebase.firestore();

let actsRef;
let userData;
let unsubscribe;
let counter;
// ****** API LOGIC ******

// *** ACTIVITY CONTROLLER ***
const controlActivity = async (id, contribution = undefined) => {
	// 1) Get existing id or generate random one
	const key = parseInt(id, 10);
	
	// If no valid key and no contribution data, fetch random activity
	if (!key && !contribution) {
		state.act = new Activity('', contribution);
	} else if (key) {
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
	} catch (err) {
		console.error(err);
	}
	if (state.act.title != undefined) {
		let liked;
		// 4) Render data
		if (user) {
			userData = db.collection('users').doc(user.uid);
			liked = await userData.get().then((doc) => {
				return doc.data().likes.some((i) => i.key == state.act.key)
			});
		} else {
			liked = state.like.isLiked(state.act.key);
		}
		clearLoader(elements.main);
		activityView.renderActivity(state.act, liked);

	} else {
		// API call failed or returned no data
		activityView.clearActivity();
		clearLoader(elements.main);
		// Always hide section on failure - don't show error messages
		// This prevents errors from showing on page load or rate limits
		if (!elements.activitySection.classList.contains('hidden')) {
			elements.activitySection.classList.add('hidden');
		}
		
		if (key) {
			console.error('ERROR: Activity not found, try again');
			// Remove like from the state
			state.act.liked = state.like.deleteLike(key);
			// Remove like from UI list
			likesView.deleteListItem(key);
		} else {
			console.error('ERROR: Could not fetch activity. The API may be rate-limited. Please try again in a moment.');
		}
	}
};
// *** APP CONTROLLER ***
const controlApp = async (likeType) => {
	if (state.app.key) {
		try {
			await state.app.updateLike(likeType);
		} catch (err) {
			console.error(err);
		}
	} else {
		console.error('Key not found');
	}
};

// *** LIKES CONTROLLER ***
const controlLike = async () => {
	activityView.clearActivity();
	clearLoader(elements.main);
	renderLoader(elements.main);

	if (!state.like) {
		state.like = new Like();
	}

	// User HAS liked current activity
	if (state.like.isLiked(state.act.key)) {
		// Remove like from the state
		state.act.liked = state.like.deleteLike(state.act.key);
		// Remove like from UI list
		likesView.deleteListItem(state.act.key);
	}
	// User HAS NOT liked current activity
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
	if (user) {
		// Add user information
		userData = db.collection('users').doc(user.uid);
		userData
			.get()
			.then(function (doc) {
				if (doc.exists) {
					state.app = new AppActivity(parseInt(state.act.key));
					let cloudData = doc.data().likes;
					state.act.liked = cloudData.some((i) => i.key == state.act.key);
					if (state.act.liked) {
						// Update user likes
						const index = cloudData.findIndex((el) => el.key == state.act.key);
						cloudData.splice(index, 1);

						// Update on app
						controlApp(false);

						state.act.liked = false;
					} else {
						// Update user likes
						cloudData.push({
							key: parseInt(state.act.key),
							title: state.act.title,
							type: state.act.type,
						});

						// Update app
						controlApp(true);

						state.act.liked = true;
					}
					userData.set({ likes: cloudData });
				} else {
					userData.set({
						likes: [
							{
								key: parseInt(state.act.key),
								title: state.act.title,
								type: state.act.type,
							},
						],
					});
				}
			})
			.catch(function (error) {
				console.error('Error al buscar documento:', error);
			});
	}
	// Toggle the like button
	activityView.clearActivity();
	clearLoader(elements.main);
	activityView.renderActivity(state.act, state.act.liked);
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
		elements.userDetails.innerHTML = `<h2 id="${user.uid}">Hola <span class=" font-bold"> ${user.displayName}</span>!</h2><span>Para hacer <b>sync </b>de tus me gustas ponle me gusta a cualquier actividad!</p>`;
	} else {
		// not signed in
		elements.whenSignedIn.hidden = true;
		elements.whenSignedOut.hidden = false;
		elements.userDetails.innerHTML = '';
	}
});

// *** FIRESTORE DATABASE ***


auth.onAuthStateChanged((user) => {
	if (user) {
		userData = db.collection('users').doc(user.uid);
		userData.get().then(function (doc) {
				if (doc.exists) {
					let cloudData = doc.data().likes;
					userData.set({ likes: cloudData });

					state.like.likes.forEach(like => likesView.deleteListItem(like.key))
					state.like.likes = cloudData;
					state.like.likes.forEach(like => likesView.renderListItem(like));}
				})
				.catch(function (error) {
					console.error('Error al buscar documento:', error);
				});
		actsRef = db.collection('activities');

		elements.createAct.onclick = () => {
			if (elements.newAct.elements.name.value != false) {
				const actAdd = {
					key: 1000001 + counter,
					uid: user.uid,
					uname: user.displayName,
					title: elements.newAct.elements.name.value,
					type: elements.newAct.elements.type.value,
					people: parseInt(elements.newAct.elements.participants.value),
					price: elements.newAct.elements.price.value / 10,
					access: elements.newAct.elements.accesibility.value / 10,
					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
					link: '',
					liked: 0,
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
					}" class="font-bold cursor-pointer hover:scale-95">${
						doc.data().title
					}- agregada por <span class="italic">${
						doc.data().uname
					}</span></h4><div class="flex flex-col md:flex-row border-primary-200 border-2 rounded-md p-2 bg-primary-300 mx-3 my-0 cursor-pointer ml-auto" >
					<h4 class="text-3xl mx-2">${doc.data().liked}</h4>
					<img class="button hover:scale-110 mx-2" src="${getLikeImage(
						true
					)}" alt="" srcset=""></img>
				</div></a> </li>`;
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
elements.signOutBtn.onclick = () => {
	auth.signOut();
	state.like.likes.forEach(like => likesView.deleteListItem(like.key))
	state.like = new Like();
	window.location.hash = '';
	state.like.readStorage();
	state.like.likes.forEach((like) => likesView.renderListItem(like));
}

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
	const id = window.location.hash.replace('#', '').trim();
	
	// If hash is empty, hide activity section and clear loader
	if (!id || id === '') {
		activityView.clearActivity();
		clearLoader(elements.main);
		if (!elements.activitySection.classList.contains('hidden')) {
			elements.activitySection.classList.add('hidden');
		}
		return;
	}
	
	// Only process if it's a valid activity ID (7 digits between 1000000-9999999)
	const numericId = parseInt(id, 10);
	if (isNaN(numericId) || numericId < 1000000 || numericId > 9999999) {
		// Invalid ID format, clear and hide section
		activityView.clearActivity();
		clearLoader(elements.main);
		if (!elements.activitySection.classList.contains('hidden')) {
			elements.activitySection.classList.add('hidden');
		}
		return;
	}
	
	// Valid ID, show section and fetch activity
	activityView.clearActivity();
	clearLoader(elements.main);
	renderLoader(elements.main);
	if (elements.activitySection.classList.contains('hidden')) {
		elements.activitySection.classList.remove('hidden');
	}
	
	state.app = new AppActivity(numericId);
	try {
		const call = await state.app.getData();
		clearLoader(elements.main);
		if (call) {
			controlActivity(numericId, state.app.data);
		} else {
			controlActivity(numericId);
		}
	} catch (err) {
		console.error('Something went wrong');
		console.error(err);
		clearLoader(elements.main);
		// Hide section on error
		if (!elements.activitySection.classList.contains('hidden')) {
			elements.activitySection.classList.add('hidden');
		}
	}
});

// Ensure activity section is hidden on DOMContentLoaded (before any other scripts run)
document.addEventListener('DOMContentLoaded', () => {
	if (elements.activitySection && !elements.activitySection.classList.contains('hidden')) {
		elements.activitySection.classList.add('hidden');
	}
	activityView.clearActivity();
});

// Restore liked recipes on page load
window.addEventListener('load', () => {
	changeLanguageByButtonClick()
	state.like = new Like();
	
	// Ensure activity section is hidden on initial load
	activityView.clearActivity();
	clearLoader(elements.main);
	if (elements.activitySection && !elements.activitySection.classList.contains('hidden')) {
		elements.activitySection.classList.add('hidden');
	}
	
	// Clear hash on initial load if it's empty or invalid
	const currentHash = window.location.hash.replace('#', '').trim();
	if (!currentHash || currentHash === '') {
		window.location.hash = '';
	} else {
		const numericId = parseInt(currentHash, 10);
		// If hash exists but is invalid, clear it
		if (isNaN(numericId) || numericId < 1000000 || numericId > 9999999) {
			window.location.hash = '';
		}
	}
	
	// Restore likes
	state.like.readStorage();

	// Render the existing likes
	state.like.likes.forEach((like) => likesView.renderListItem(like));
});
