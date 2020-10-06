import { elements, getImage, getLikeImage} from './base.js';

import accessImg from '../assets/accesibility.svg';
import priceImg from '../assets/price.svg';
import partImg from '../assets/participants.svg';

export const renderActivity = (activity, isLiked) => {
  let markup;
  if (activity != undefined){

    markup = `     
                  <div class="flex justify-between items-center ">
              <h3 class="text-xl font-bold pl-6 capitalize"><a href="#${
                activity.link
              }">${activity.title}</a></h3>
                  <div class="bg-primary-200 px-6 py-2 cursor-pointer" id="like">
                      <img class="button hover:scale-110 " src="${getLikeImage(isLiked)}" alt="" srcset="">
                  </div>
              </div>
              <div class="h-1 bg-primary-200"></div>
                  <div class="font-semibold flex flex-col md:flex-row justify-evenly items-center p-3">            
                      <h4>Categoria: <span class="font-bold capitalize">${
                        activity.type
                      }</span></h4>
                      <img src="${getImage(activity.type)}" heigh="48" width="48">
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
  } else if (activity == undefined && isLiked == false){
    markup = `<div class="bg-red-700 h-full w-full text-center">
    <h1 class="text-white font-extrabold p-6">Error: puede deberse a permisos, conexion o falta de data. Intente de vuelta</h1>
  </div>`
  } else if(activity == undefined && isLiked == true) {
    markup = `<div class="bg-gray-400 h-full w-full text-center">
    <h1 class="text-gray-800 font-extrabold p-6">Para activar la funcionalidad de me gustas, debe registrarse</h1>
  </div>`
  }
	elements.activitySection.insertAdjacentHTML('afterbegin', markup);
};

export const clearActivity = () => {
	elements.activitySection.innerHTML = '';
	// window.location.hash = '';
};
