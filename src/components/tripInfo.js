// Разметка информации о маршруте
const getTripInfoMarkup = (events) => {
  const firstDay = events[0];
  const {cities: firstDayCities, time: {timeStartEvent, timeFinishEvent}} = firstDay;
  return `
  <div class="trip-info__main">
  ${firstDayCities.length > 3 ?
    ` <h1 class="trip-info__title">${firstDayCities[0]} &mdash; ... &mdash; ${firstDayCities[firstDayCities.length - 1]}</h1>` :
    `<h1 class="trip-info__title">${firstDayCities.join(`-`)}</h1>`}
    <p class="trip-info__dates">${new Date(timeStartEvent).toDateString().substr(4, 6)}&nbsp;&mdash;&nbsp;${new Date(timeFinishEvent).toDateString().substr(4, 6)}</p>
  </div>
`;
};

export {getTripInfoMarkup};
