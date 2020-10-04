import { elements } from './base.js';

import busyworkImg from '../assets/busywork.svg';
import charityImg from '../assets/charity.svg';
import relaxationImg from '../assets/relaxation.svg';
import musicImg from '../assets/music.svg';
import socialImg from '../assets/social.svg';
import recreationalImg from '../assets/recreational.svg';
import diyImg from '../assets/diy.svg';
import cookingImg from '../assets/cooking.svg';
import educationImg from '../assets/education.svg';



export const renderListItem = (activity) => {
  let actImg;
  switch (activity.type) {
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

    const html = `
            <li>
              <a href="#${activity.key}" class="border-primary-300 border-2 flex flex-row px-6 py-4 justify-evenly">
                <img src="${actImg}" heigh="48" width="48">
                <h4 class="text-base p-2">${activity.title}</h4>
              </a>
            </li>`;
    elements.likes.insertAdjacentHTML('beforeend', html);
};

export const deleteListItem = id => {
    const el = document.querySelector(`a[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}
