import {getRandomBoolean} from "../utils/util";

const generateMenu = (title, active = getRandomBoolean()) => {
  return {
    title,
    active,
  };
};

// Создаем моки для меню
const getMockMenu = () => {
  return [
    generateMenu(`Table`),
    generateMenu(`Stats`)
  ];
};

// Разметка меню
const getTripMenuMarkup = () => `
        <nav class="trip-controls__trip-tabs  trip-tabs">
        ${getMockMenu().map(({title, active}) => `<a class="trip-tabs__btn ${active ? `trip-tabs__btn--active` : ``}" href="#">${title}</a>`).join(``)}
        </nav>
`;

export {getTripMenuMarkup};
