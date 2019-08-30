// Разметка информации о маршруте
const getTripInfoMarkup = (events) => {
  const {city: firstCity, time: {timeStartEvent}} = events[0];
  const {city: lastCity, time: {timeFinishEvent}} = events[events.length - 1];
  const cities = events.map(({cityEvent}) => cityEvent);
  return `
  <div class="trip-info__main">
  ${events.length > 3 ?
    `<h1 class="trip-info__title">${firstCity} &mdash; ... &mdash; ${lastCity}</h1>` :
    `<h1 class="trip-info__title">${cities.slice(0, 3).join(`-`)}</h1>`}
    <p class="trip-info__dates">${new Date(timeStartEvent).toDateString().substr(4, 6)}&nbsp;&mdash;&nbsp;${new Date(timeFinishEvent).toDateString().substr(4, 6)}</p>
  </div>
`;
};

export {getTripInfoMarkup};
