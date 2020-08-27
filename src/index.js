import  { elements, renderLoader, clearLoader  } from "./base.js";
import Activity from "./modules/Activity.js";
import * as activityView from "./views/activityView.js"

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

// Todo:
// Add API data in HTML
// Handle button click
// Fetch user input
// Post to modified api
// Store in localstorage

const state = {};

const controlActivity = async () => {
  renderLoader(elements.main);
  activityView.clearActivity();
  
  const id = window.location.hash.replace('#', '');
  if(id >= 1000000 && id <= 9999999) {
    state.act = new Activity(id);
  } else {
    state.act = new Activity();
  }
  // Fetch API data
  try {
    await state.act.getResults();
    // Prepare UI

    clearLoader(elements.main);

    activityView.renderActivity(state.act);
    console.log(state.act)

  } catch (err) {
    console.log(err);
  }
  // Create new activity from url obtained from likes
};

// window.addEventListener('hashchange', controlActivity);
elements.activityButton.addEventListener('click', controlActivity)