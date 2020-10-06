import busyworkImg from '../assets/busywork.svg';
import charityImg from '../assets/charity.svg';
import relaxationImg from '../assets/relaxation.svg';
import musicImg from '../assets/music.svg';
import socialImg from '../assets/social.svg';
import recreationalImg from '../assets/recreational.svg';
import diyImg from '../assets/diy.svg';
import cookingImg from '../assets/cooking.svg';
import educationImg from '../assets/education.svg';

import likeTrueImg from '../assets/like-true.svg';
import likeFalseImg from '../assets/like-false.svg';

export const elements = {
    nav: document.querySelector('#nav'),
    menu: document.querySelector('#menu'),
    likes: document.querySelector('#likes'),
    activitySection: document.querySelector('#section1'),
    main : document.querySelector('#main'),
    likeToggle : document.querySelector('#like'),
    body: document.querySelector('#body'),

    whenSignedIn : document.getElementById('whenSignedIn'),
    whenSignedOut : document.getElementById('whenSignedOut'),
    signInBtn : document.getElementById('signInBtn'),
    signOutBtn : document.getElementById('signOutBtn'),
    userDetails : document.getElementById('userDetails'),

    createAct : document.getElementById('createAct'),
    actsList : document.getElementById('actsList'),
    newAct : document.getElementById('newAct')
};

export const getLikeImage = (liked) =>{
  let likeImg;
  if (liked) {
    likeImg = likeTrueImg
  } else {
    likeImg = likeFalseImg
  };
  return likeImg
}

export const getImage = (type) => {
    let actImg;
    switch (type) {
      case 'busywork' :
        actImg = busyworkImg;
        break;
      case 'charity' :
        actImg = charityImg;
        break;
      case 'cooking' :
        actImg = cookingImg;
        break;
      case 'diy' :
        actImg = diyImg;
        break;
      case 'education' :
        actImg = educationImg;
        break;
      case 'music' :
        actImg = musicImg;
        break;
      case 'recreational' :
        actImg = recreationalImg;
        break;
      case 'relaxation' :
        actImg = relaxationImg;
        break;
      case 'social' :
        actImg = socialImg;
        break;
      default :
      actImg = '';
    }

    return actImg;
}

export const renderLoader = parent => {
    const markup = `
    <svg id="loader" class="animate-spin my-10 mx-auto h-16 w-16 text-center text-primary-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-50" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg> 
    `;
    parent.insertAdjacentHTML('afterend', markup);
};

export const clearLoader = () => {
    const loader = document.querySelector('#loader');
    if (loader) loader.parentElement.removeChild(loader);
};