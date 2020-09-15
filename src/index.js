import { elements, renderLoader, clearLoader } from './views/base.js';
import Activity from './modules/Activity.js';
// import Like from './modules/Likes.js';
import * as activityView from './views/activityView.js';
import * as likesView from './views/likesView.js';


// Todo:
// Fetch user input
// Post to modified api
// Store in localstorage

const state = {};
state.likes = [];

// *** ACTIVITY CONTROLLER ***
const controlActivity = async (id) => {
	// 1) Get existing id or generate random one
	const key = parseInt(id, 10)
	if(key){
		state.act = new Activity(key);
	}	
	else {
		state.act = new Activity();
	}

	// 2) Prepare UI
	activityView.clearActivity();
	clearLoader(elements.main);
	renderLoader(elements.main);
	try {
		// 3) Fetch API data
		await state.act.getResults();

		if (state.act.title != undefined) {
			const liked = state.likes.includes(state.act.key)
			clearLoader(elements.main);
			activityView.renderActivity(state.act, liked);
		} else {
			console.error('ERROR: Activiy not found, try again')
		}
			// 4) Render data
	} catch (err) {
		console.log(err);
	}
};
// *** LIKES CONTROLLER ***
const controlLike = () =>{
	// State.likes
	// state.likes = new Like();
	// User HAS liked current recipe
	if (state.likes.includes(state.act.key)) {
		// Remove like from the state
		state.act.liked = false;
		const i = state.likes.findIndex(cur => cur === state.act.key);
		state.likes.splice(i, 1);
		// Remove like from UI list
		likesView.deleteListItem(state.act.key)
	}
	// User HAS NOT liked current recipe
	else {
		// Add like to the state
		state.act.liked = true;
		state.likes.push(state.act.key);
		// Add like to UI list
		likesView.renderListItem(state.act);
	}
	console.log(state.likes)
	// Toggle the like button
	activityView.clearActivity();
	activityView.renderActivity(state.act, state.act.liked);
}

// *** EVENT HANDLING ***
// Handle Menu
elements.burger.addEventListener('click', () => {
	if (elements.menu.classList.contains('hidden')) {
		elements.menu.classList.remove('hidden');
	} else {
		elements.menu.classList.add('hidden');
	}
});

// Handle Likes Button
elements.likesBtn.addEventListener('click', () => {
	if (elements.likes.classList.contains('hidden')) {
		elements.likes.classList.remove('hidden');
	} else {
		elements.likes.classList.add('hidden');
	}
});

// Toggle like button
elements.activitySection.addEventListener('click', e => { 
	if (e.target.matches('#like, #like *')) {
		controlLike();
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

// Generate new activity
elements.activityButton.addEventListener('click', controlActivity);

