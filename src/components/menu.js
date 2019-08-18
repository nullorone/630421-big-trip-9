import {getMockMenu} from "../data";

// Разметка меню
const getTripMenuMarkup = () => `
        <nav class="trip-controls__trip-tabs  trip-tabs">
        ${getMockMenu().map(({title, active}) => `<a class="trip-tabs__btn ${active ? `trip-tabs__btn--active` : ``}" href="#">${title}</a>`).join(``)}
        </nav>
`;

export {getTripMenuMarkup};
