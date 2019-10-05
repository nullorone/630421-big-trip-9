// Разметка формы редактирования события путешествия
import {types, apiSettings} from "../data";
import {transformTypeEvent} from "../utils/util";
import Abstract from "./abstract";
import Api from "../api";
import flatpickr from "flatpickr";
import moment from "moment";

export default class EventEdit extends Abstract {
  constructor(mockEvent) {
    super();
    this._id = mockEvent.id;
    this._iconSrc = mockEvent.type.iconSrc;
    this._title = mockEvent.type.title;
    this._price = mockEvent.price;
    this._city = mockEvent.city;
    this._offers = mockEvent.offers;
    this._timeStartEvent = mockEvent.time.timeStartEvent;
    this._timeFinishEvent = mockEvent.time.timeFinishEvent;
    this._images = mockEvent.images;
    this._description = mockEvent.description;
    this._timeStartEventValueFormat = this.getFormattingTimeValue(this._timeStartEvent);
    this._timeFinishEventValueFormat = this.getFormattingTimeValue(this._timeFinishEvent);
    this._favorite = mockEvent.favorite;
    this._eventEditStartTime = flatpickr(this.getElement().querySelector(`.event__input--time[name=event-start-time]`), {
      defaultDate: new Date(this._timeStartEvent),
      altInput: true,
      altFormat: `d.m.Y H:i`,
      dateFormat: `d.m.Y H:i`,
      minDate: new Date(this._timeStartEvent),
      enableTime: true,
      minTime: new Date(this._timeStartEvent).toLocaleTimeString(),
      maxTime: new Date(this._timeFinishEvent).toLocaleTimeString(),
    });
    this._eventEditFinishTime = flatpickr(this.getElement().querySelector(`.event__input--time[name=event-end-time]`), {
      defaultDate: new Date(this._timeFinishEvent),
      altInput: true,
      altFormat: `d.m.Y H:i`,
      dateFormat: `d.m.Y H:i`,
      minDate: new Date(this._timeFinishEvent),
      enableTime: true,
      minTime: new Date(this._timeFinishEvent).toLocaleTimeString(),
      maxTime: `23:59`,
    });
    this._api = new Api(apiSettings);
    this._descriptionData = null;

    this._api.getDestinations().then((destinations) => {
      this._descriptionData = this.transformDestinations(destinations);
      this.generateDestinations(destinations);
    });

    this._descriptionEvent = this.insertDescription.bind(this);
    this._imagesEvent = this.insertImage.bind(this);
  }

  transformDestinations(destinations) {
    return destinations.reduce((acc, val) => {
      const {name} = val;
      if (!acc[name]) {
        acc[name] = {};
      }

      acc[name][`description`] = val.description;
      acc[name][`pictures`] = val.pictures;
      return acc;
    }, {});
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

  getEventOffers(offers) {
    return offers.size ? `
        <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
            <div class="event__available-offers">
              ${[...offers].map(({price, title, accepted}, index) => `
               <div class="event__offer-selector">
                  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title.toLowerCase().split(` `).join(`-`)}-${index}" type="checkbox" name="event-offer-${name.toLowerCase().split(` `).join(`-`)}" ${accepted ? `checked` : ``}>
                  <label class="event__offer-label" for="event-offer-${title.toLowerCase().split(` `).join(`-`)}-${index}">
                    <span class="event__offer-title">${title}</span>
                    &plus;
                    &euro;&nbsp;<span class="event__offer-price">${price}</span>
                  </label>
                </div>`.trim()).join(``)}
            </div>
        </section>`.trim() : ``;
  }

  getOffers(offers) {
    return `
        <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
            <div class="event__available-offers">
              ${[...offers].map(({name, price, title}, index) => `
               <div class="event__offer-selector">
                  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name.toLowerCase().split(` `).join(`-`)}-${index}" type="checkbox" name="event-offer-${name.toLowerCase().split(` `).join(`-`)}">
                  <label class="event__offer-label" for="event-offer-${name.toLowerCase().split(` `).join(`-`)}-${index}">
                    <span class="event__offer-title">${title}</span>
                    &plus;
                    &euro;&nbsp;<span class="event__offer-price">${price}</span>
                  </label>
                </div>`.trim()).join(``)}
            </div>
        </section>`.trim();
  }

  getEventImg(images) {
    return images.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`.trim()).join(``);
  }

  insertImage(city) {
    const images = this._descriptionData[city].pictures;
    return `<div class="event__photos-container">
            <div class="event__photos-tape">
            ${this.getEventImg(images)}
            </div>
          </div>`.trim();
  }

  insertDescription(city) {
    const descriptionText = this._descriptionData[city].description;
    return `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${descriptionText}</p>`.trim();
  }

  insertDestinationList(destinations) {
    this.getElement()
      .querySelector(`#destination-list-1`)
      .insertAdjacentHTML(`beforeend`, destinations);
  }

  generateDestinations(destinations) {
    const destinationsMarkup = [...destinations].map(({name}) => `<option value="${name}"></option>`).join(``);

    this.insertDestinationList(destinationsMarkup);
  }

  getFormattingTimeValue(time) {
    return `${moment(time).format(`DD/MM/YYYY HH:mm`)}`;
  }

  setStyleErrorEventEdit(state) {
    if (state) {
      this.getElement().classList.add(`red-border`);
      this.getElement().classList.add(`shake`);
    } else {
      this.getElement().classList.remove(`red-border`);
      this.getElement().classList.remove(`shake`);
    }
  }

  changeTextOnButton(text) {
    switch (true) {
      case (text === `Saving`):
        this.getElement().querySelector(`.event__save-btn`).innerText = `${text}...`;
        break;
      case (text === `Save`):
        this.getElement().querySelector(`.event__save-btn`).innerText = `${text}`;
        break;
      case (text === `Deleting`):
        this.getElement().querySelector(`.event__reset-btn`).innerText = `${text}...`;
        break;
      case (text === `Delete`):
        this.getElement().querySelector(`.event__reset-btn`).innerText = `${text}`;
        break;
    }
  }

  changeFormUi(stateDisabled) {
    Array.from(this.getElement().querySelectorAll(`input:not(.flatpickr-input)`)).map((input) => {
      input.disabled = stateDisabled;
    });
    Array.from(this.getElement().querySelectorAll(`button`)).map((button) => {
      button.disabled = stateDisabled;
    });
  }

  getTemplate() {
    return `
<li class="trip-events__item" data-event-id="${this._id}">
    <form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${this._iconSrc}" alt="Event type icon">
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
            ${transformTypeEvent(this._title)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
          <datalist id="destination-list-1">
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" pattern="[0-9]*" value="${this._price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._favorite ? `checked` : ``}>
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

      ${this.getEventOffers(this._offers)}

        <section class="event__section  event__section--destination">
          ${this._descriptionEvent ? this._descriptionEvent : `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${this._description}</p>`.trim()}

          ${this._imagesEvent ? this._imagesEvent : `<div class="event__photos-container">
            <div class="event__photos-tape">
            ${this.getEventImg(this._images)}
            </div>
          </div>`.trim()}
        </section>
      </section>
    </form>
  </li>`.trim();
  }
}
