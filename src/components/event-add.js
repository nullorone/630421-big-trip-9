// Разметка формы добавления события путешествия
import {types, apiData} from "../data";
import Abstract from "./abstract";
import Api from "../api";
import flatpickr from "flatpickr";
import {transformTypeEvent} from "../utils/util";
import moment from "moment";

export default class EventAdd extends Abstract {
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
    this._eventEditStartTime = flatpickr(this.getElement().querySelector(`.event__input--time[name=event-start-time]`), {
      defaultDate: new Date(this._timeStartEvent),
      altInput: true,
      altFormat: `Y/m/d H:i`,
      dateFormat: `Y/m/d H:i`,
      minDate: new Date(this._timeStartEvent),
      enableTime: true,
      minTime: new Date(this._timeStartEvent).toLocaleTimeString(),
      maxTime: new Date(this._timeFinishEvent).toLocaleTimeString(),
    });
    this._eventEditFinishTime = flatpickr(this.getElement().querySelector(`.event__input--time[name=event-end-time]`), {
      defaultDate: new Date(this._timeFinishEvent),
      altInput: true,
      altFormat: `Y/m/d H:i`,
      dateFormat: `Y/m/d H:i`,
      minDate: new Date(this._timeFinishEvent),
      enableTime: true,
      minTime: new Date(this._timeFinishEvent).toLocaleTimeString(),
      maxTime: `23:59`,
    });
    this._api = new Api(apiData);
    this._descriptionData = null;

    this._api.getDestinations().then((destinations) => {
      this._descriptionData = this.transformDestinations(destinations);
      this.generateDestinations(destinations);
    });

    this._descriptionEvent = this.insertDescription.bind(this);
    this._imagesEvent = this.insertImage.bind(this);
  }

  get descriptions() {
    return this._descriptionData;
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

  generateDestinations(destinationsData) {
    const destinationsMarkup = [...destinationsData].map(({name}) => `<option value="${name}"></option>`).join(``);

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
          <form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
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
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._timeStartEventValueFormat}">
                &mdash;
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
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
            
      <section class="event__details">

      ${this.getEventOffers(this._offers)}

        <section class="event__section  event__section--destination">
        ${this._descriptionEvent || ``}
        ${this._imagesEvent || ``}
        </section>
      </section>
            
          </form>
  </li>`.trim();
  }
}
