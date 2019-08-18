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

export {getMockMenu};
