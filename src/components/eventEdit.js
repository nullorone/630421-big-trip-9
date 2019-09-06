// Разметка формы редактирования события путешествия
import {types, CITIES} from "../data";
import AbstractEvent from "./abstract-event";

export default class EventEdit extends AbstractEvent {
  constructor(event) {
    super(event);
    this._timeStartEventValueFormat = this.getFormattingTimeValue(this._timeStartEvent);
    this._timeFinishEventValueFormat = this.getFormattingTimeValue(this._timeFinishEvent);
  }

  getEventGroup(nameGroup) {
    return [...nameGroup].map(({id, title}, index) => `
              <div class="event__type-item">
                <input id="event-type-${id}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${id}">
                <label class="event__type-label  event__type-label--${id}" for="event-type-${id}-${index}">${title}</label>
              </div>
              `.trim()).join(``);
  }

  get eventTransferGroup() {
    const [{transfer}] = types;
    return this.getEventGroup(transfer);
  }

  get eventActivityGroup() {
    const [{activity}] = types;
    return this.getEventGroup(activity);
  }

  getEventOffers() {
    return [...this._offers].map(({id, title, price, isChecked}) => `
             <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-luggage" ${isChecked ? `checked` : ``}>
                <label class="event__offer-label" for="event-offer-${id}-1">
                  <span class="event__offer-title">${title}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${price}</span>
                </label>
              </div>
             `.trim()).join(``);
  }

  getEventImg() {
    return this._img.map((src) => `<img class="event__photo" src="${src}" alt="Event photo">`.trim()).join(``);
  }

  getDestinationList() {
    return CITIES.map((cityItem) => `<option value="${cityItem}"></option>`);
  }

  getFormattingTimeValue(time) {
    return (new Date(time).toLocaleString().slice(0, 10).split(`.`).join(`/`) + new Date(time).toTimeString().substr(0, 5));
  }

  getTemplate() {
    return `
<li class="trip-events__item">
    <form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._iconName}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${this.eventTransferGroup}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${this.eventActivityGroup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${this._title}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${this.getDestinationList()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._timeStartEventValueFormat}"
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._timeFinishEventValueFormat}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
      
      ${this._offers.size ? `
        <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
            <div class="event__available-offers">
            ${this.getEventOffers()}
            </div>
          </section>` : ``}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${this._description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${this.getEventImg()}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`.trim();
  }
}
