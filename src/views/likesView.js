import { elements, getImage } from './base.js';

export const renderListItem = (activity) => {
    const html = `
            <li>
              <a href="#${activity.key}" class="border-primary-300 border-2 flex flex-row px-6 py-4 justify-evenly">
                <img src="${getImage(activity.type)}" heigh="48" width="48">
                <h4 class="text-base p-2">${activity.title}</h4>
              </a>
            </li>`;
    elements.likes.insertAdjacentHTML('beforeend', html);
};

export const deleteListItem = id => {
    const el = document.querySelector(`a[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}
