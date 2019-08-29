// Разметка информации о маршруте
const getTripInfoMarkup = (events) => {
  const firstDay = events[0];
  const lastDay = events[events.length - 1];
  const {city, time: {timeStartEvent, timeFinishEvent}} = firstDay;
  const cities = events.map(({cityEvent}) => cityEvent);
  return `
  <div class="trip-info__main">
  ${events.length > 3 ?
    `<h1 class="trip-info__title">${city} &mdash; ... &mdash; ${lastDay.city}</h1>` :
    `<h1 class="trip-info__title">${cities.slice(0, 3).join(`-`)}</h1>`}
    <p class="trip-info__dates">${new Date(timeStartEvent).toDateString().substr(4, 6)}&nbsp;&mdash;&nbsp;${new Date(timeFinishEvent).toDateString().substr(4, 6)}</p>
  </div>
`;
};

export {getTripInfoMarkup};
