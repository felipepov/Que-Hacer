import { elements, renderLoader, clearLoader } from './views/base.js';
import Activity from './modules/Activity.js';
import Like from './modules/Likes.js';
import * as activityView from './views/activityView.js';
import * as likesView from './views/likesView.js';


// Todo:
// - Add user contributed activities to be fetched
// - Add liked parameter to collection
// - Add liked activity to database, checking if not already there
// - Update liked parameter on activity when liked by user

const state = {};
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
			const liked = state.like ? state.like.isLiked(state.act.key) : false;
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

// *** EVENT HANDLING ***
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
elements.main.addEventListener('click', e => {
	// Toggle like button
	if (e.target.matches('#like, #like *')) {
		controlLike();
		// Generate new activity
	} else if (e.target.matches('#generate, #generate *')) {
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
