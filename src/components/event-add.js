// Разметка формы добавления события путешествия
import {transformTypeEvent} from "../utils/util";
import EventEdit from "./event-edit";

export default class EventAdd extends EventEdit {
  constructor(mockEvent) {
    super(mockEvent);
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
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" pattern="[0-9]*" value="${this._price}">
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
