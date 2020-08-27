import  { elements } from "../base.js";

export const  renderActivity  = (activity, isLiked = 'false') => {
    const markup = `     
                <div class="flex justify-between items-center ">
            <h3 class="text-xl font-bold pl-6 capitalize"><a href="#${activity.link}">${activity.title}</a></h3>
                <div class="bg-primary-200 px-6 py-2">
                    <img class="pointer hover:scale-110 transition-transform" src="img/like-${isLiked}.svg" alt="" srcset="">
                </div>
            </div>
            <div class="h-1 bg-primary-200"></div>
                <div class="font-semibold flex flex-col md:flex-row justify-evenly items-center p-3">            
                    <h4>Categoria: <span class="font-bold capitalize">${activity.type}</span></h4>
                    <img src="img/${activity.type}.svg" heigh="48" width="48">
                    <h4>Participantes: <span class="font-bold">${activity.people}</span></h4>
                    <img src="img/participants.svg" heigh="48" width="48">
                    <h4>Accesibilidad: <span class="font-bold">${Math.round(activity.access*10)} / 10</span></h4>
                    <img src="img/accesibility.svg" heigh="48" width="48">
                    <h4>Precio: <span class="font-bold">${Math.round(activity.price*10)} / 10</span></h4>
                    <img src="img/price.svg" heigh="48" width="48">
                </div>
    `;
    elements.activitySection.insertAdjacentHTML('afterbegin', markup);
}

export const clearActivity = () =>{
    elements.activitySection.innerHTML = '';
    window.location.hash = '';
}