import Event from "../components/event";
import EventEdit from "../components/eventEdit";
import {renderComponent, convertTimeData} from "../utils/util";

export default class PointController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._event = new Event(this._data);
    this._eventEdit = new EventEdit(this._data);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;

    this.init();
  }

  init() {
    const onEventEditEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
        document.removeEventListener(`keydown`, onEventEditEscKeyDown);
      }
    };

    const onEventRollupButtonClick = (evt) => {
      evt.preventDefault();
      this._onChangeView();
      this._container.replaceChild(this._eventEdit.getElement(), this._event.getElement());
      document.addEventListener(`keydown`, onEventEditEscKeyDown);
      this._event.getElement().removeEventListener(`click`, onEventRollupButtonClick);
    };

    const onEventEditRollupButtonClick = (evt) => {
      evt.preventDefault();
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
      document.removeEventListener(`keydown`, onEventEditEscKeyDown);
      this._eventEdit.getElement().removeEventListener(`click`, onEventEditRollupButtonClick);
    };

    const onEventEditSubmit = onEventEditRollupButtonClick;

    this._event.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEventRollupButtonClick);

    this._eventEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEventEditRollupButtonClick);

    this._eventEdit.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, onEventEditSubmit);

    this._eventEdit.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._eventEdit.getElement().querySelector(`.event`));

        const eventImages = Array.from(this._eventEdit.getElement().querySelectorAll(`.event__photo`)).map((image) => image.src);

        const eventOffers = Array.from(this._eventEdit.getElement().querySelectorAll(`.event__offer-selector`)).map((offer) => ({
          id: offer.querySelector(`.event__offer-checkbox`).name.slice(12),
          title: offer.querySelector(`.event__offer-title`).innerText,
          price: offer.querySelector(`.event__offer-price`).innerText,
          isChecked: offer.querySelector(`.event__offer-checkbox`).checked,
        }));

        const entry = {
          type: {
            iconSrc: this._eventEdit.getElement().querySelector(`.event__type-icon`).src,
            title: this._eventEdit.getElement().querySelector(`.event__type-output`).innerText,
          },
          city: formData.get(`event-destination`),
          img: eventImages,
          description: this._eventEdit.getElement().querySelector(`.event__destination-description`).innerText,
          time: {
            timeStartEvent: convertTimeData(formData.get(`event-start-time`)),
            timeFinishEvent: convertTimeData(formData.get(`event-end-time`)),
          },
          price: formData.get(`event-price`),
          offers: eventOffers,
        };

        this._onDataChange(entry, this._data);
      });

    renderComponent(this._container, this._event.getElement(), `beforeend`);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }
}

