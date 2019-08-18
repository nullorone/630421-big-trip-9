import {getRandomBoolean} from "./utils/util";

// Создаем моки для меню
const getMockMenu = () => {
  return [
    {
      title: `Table`,
      active: getRandomBoolean(),
    },
    {
      title: `Stats`,
      active: getRandomBoolean(),
    },
  ];
};

// Создаем моки для фильтров
const getMockFilter = () => {
  return [
    {
      filter: `Everything`,
      checked: getRandomBoolean(),
    },
    {
      filter: `Future`,
      checked: getRandomBoolean(),
    },
    {
      filter: `Past`,
      checked: getRandomBoolean(),
    },
  ];
};


export {getMockMenu, getMockFilter};
