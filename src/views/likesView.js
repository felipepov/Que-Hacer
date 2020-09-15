import { elements } from './base.js';

export const renderListItem = (activity) => {
    const html = `
    <div id="ID${activity.key}">
        <a href="#${activity.key}">
            <li class="border-white border-2 flex flex-row px-6 py-4 justify-evenly">
                <img src="img/${activity.type}.svg" heigh="48" width="48">
                <h4 class="text-base p-2">${activity.title}</h4>
            </li>
        </a>
    </div>`;
    elements.likes.insertAdjacentHTML('beforeend', html);
};

export const deleteListItem = (key) => {
    document.querySelector(`#ID${key}`).innerHTML = ''
}
