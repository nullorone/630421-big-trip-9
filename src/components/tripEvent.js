// Разметка карточки путешествия
const getTripEventMarkup = ({
  type: {iconName, title},
  price,
  offers,
  time: {
    timeStartEvent,
    timeFinishEvent,
    duration: {
      days,
      hours,
      minutes,
    }
  }}) => {
  return `
    <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${iconName}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${title} airport</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${new Date(timeStartEvent).toISOString().substr(0, 16)}">${new Date(timeStartEvent).toTimeString().substr(0, 5)}</time>
              &mdash;
              <time class="event__end-time" datetime="${new Date(timeFinishEvent).toISOString().substr(0, 16)}">${new Date(timeFinishEvent).toTimeString().substr(0, 5)}</time>
            </p>
            <p class="event__duration">${days} ${hours} ${minutes}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
          ${[...offers].map(({title: offerTitle, price: offerPrice}) => `
             <li class="event__offer">
              <span class="event__offer-title">${offerTitle}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
             </li>
             `).join(``)}
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
`;
};

export {getTripEventMarkup};
