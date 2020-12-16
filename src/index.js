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
// - Translate everything
// - App Likes

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
	} catch (err) {
		console.error(err);
	}
	if (state.act.title != undefined) {
		let liked;
		// 4) Render data
		const user = firebase.auth().currentUser;
		if (user) {
			const userData = db.collection('users').doc(user.uid);
			liked = await userData.get().then((doc) => {
				return doc.data().likes.some((i) => i.key == state.act.key)
			});
		} else {
			liked = state.like.isLiked(state.act.key);
		}
		console.log('Is it liked? ' + liked)
		clearLoader(elements.main);
		activityView.renderActivity(state.act, liked);
	} else {
		activityView.clearActivity();
		clearLoader(elements.main);
		activityView.renderActivity(undefined, false);
		console.error('ERROR: Activiy not found, try again');
		// Remove like from the state
		state.act.liked = state.like.deleteLike(key);
		// Remove like from UI list
		likesView.deleteListItem(key);
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
	const user = firebase.auth().currentUser;
	if (user) {
		// Add user information
		const userData = db.collection('users').doc(user.uid);
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
		elements.userDetails.innerHTML = `<h3>Hola <span class=" font-bold"> ${user.displayName}</span>!</h3> <p>ID de Usuario: <span class=" font-bold">${user.uid}</span><br><span>Para hacer <b>sync </b>de tus me gustas ponle me gusta a cualquier actividad!</p>`;
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
let userData;
let unsubscribe;
let counter;

auth.onAuthStateChanged((user) => {
	if (user) {
		userData = db.collection('users').doc(user.uid);
		userData.get().then(function (doc) {
				if (doc.exists) {
					let cloudData = doc.data().likes;
					userData.set({ likes: cloudData });

					state.like.likes.forEach(like => likesView.deleteListItem(like.key))
					console.log('Likes before user')
					console.log(state.like.likes)
					console.log('Likes from cloud about to be added')
					console.log(cloudData)
					state.like.likes = cloudData;
					console.log('Likes when user')
					console.log(state.like.likes)
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
	activityView.clearActivity();
	clearLoader(elements.main);
	renderLoader(elements.main);
	if (elements.activitySection.classList.contains('hidden')) {
		elements.activitySection.classList.remove('hidden');
	}
	const id = window.location.hash.replace('#', '');
	state.app = new AppActivity(parseInt(id));
	if (id >= 1000000 && id <= 9999999) {
		try {
			const call = await state.app.getData();
			clearLoader(elements.main)
			if (call) {
				controlActivity(id, state.app.data);
			} else {
				controlActivity(id);
			}
		} catch (err) {
			console.error('Something went wrong');
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
