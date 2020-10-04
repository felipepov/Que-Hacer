import { elements } from './base.js';

import accessImg from '../assets/accesibility.svg';
import priceImg from '../assets/price.svg';
import partImg from '../assets/participants.svg';

import likeTrueImg from '../assets/like-true.svg';
import likeFalseImg from '../assets/like-false.svg';

import busyworkImg from '../assets/busywork.svg';
import charityImg from '../assets/charity.svg';
import relaxationImg from '../assets/relaxation.svg';
import musicImg from '../assets/music.svg';
import socialImg from '../assets/social.svg';
import recreationalImg from '../assets/recreational.svg';
import diyImg from '../assets/diy.svg';
import cookingImg from '../assets/cooking.svg';
import educationImg from '../assets/education.svg';

export const renderActivity = (activity, isLiked) => {
  let likeImg;
  if (isLiked) {
    likeImg = likeTrueImg
  } else {
    likeImg = likeFalseImg
  };

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

	const markup = `     
                <div class="flex justify-between items-center ">
            <h3 class="text-xl font-bold pl-6 capitalize"><a href="#${
							activity.link
						}">${activity.title}</a></h3>
                <div class="bg-primary-200 px-6 py-2 cursor-pointer" id="like">
                    <img class="pointer hover:scale-110 transition-transform" src="${likeImg}" alt="" srcset="">
                </div>
            </div>
            <div class="h-1 bg-primary-200"></div>
                <div class="font-semibold flex flex-col md:flex-row justify-evenly items-center p-3">            
                    <h4>Categoria: <span class="font-bold capitalize">${
											activity.type
										}</span></h4>
                    <img src="${actImg}" heigh="48" width="48">
                    <h4>Participantes: <span class="font-bold">${
											activity.people
										}</span></h4>
                    <img src="${partImg}" heigh="48" width="48">
                    <h4>Accesibilidad: <span class="font-bold">${Math.round(
											activity.access * 10
										)} / 10</span></h4>
                    <img src="${accessImg}" heigh="48" width="48">
                    <h4>Precio: <span class="font-bold">${Math.round(
											activity.price * 10
										)} / 10</span></h4>
                    <img src="${priceImg}" heigh="48" width="48">
                </div>
    `;
	elements.activitySection.insertAdjacentHTML('afterbegin', markup);
};

export const clearActivity = () => {
	elements.activitySection.innerHTML = '';
	window.location.hash = '';
};
