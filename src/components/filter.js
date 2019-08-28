// Создаем моки для фильтров
const getMockFilter = () => {
  return [
    {
      title: `Everything`,
      isActive: true,
    },
    {
      title: `Future`,
      isActive: false,
    },
    {
      title: `Past`,
      isActive: false,
    }
  ];
};

// Разметка фильтров
const getTripFilterMarkup = () => `
  <form class="trip-filters" action="#" method="get">
  ${getMockFilter().map(({title, isActive}) => `<div class="trip-filters__filter">
      <input id="filter-${title.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${title.toLowerCase()}" ${isActive ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${title.toLowerCase()}">${title}</label>
    </div>`).join(``)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export {getTripFilterMarkup};

