import Event from "../components/event";
import EventEdit from "../components/eventEdit";
import {renderComponent, createElement, unrenderComponent} from "../utils/util";
import {getOffers, getRandomDescription, Mode} from "../data";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/airbnb.css";

export default class PointController {
  constructor(container, mode, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._event = new Event(this._data);
    this._eventEdit = new EventEdit(this._data);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._eventEditStartTime = flatpickr(this._eventEdit.getElement().querySelector(`#event-start-time-1`), {
      defaultDate: new Date(this._eventEdit._timeStartEvent),
      altInput: true,
      altFormat: `Y/m/d H:i`,
      dateFormat: `Y/m/d H:i`,
      minDate: new Date(this._eventEdit._timeStartEvent),
      maxDate: new Date(this._eventEdit._timeFinishEvent),
      enableTime: true,
      minTime: new Date(this._eventEdit._timeStartEvent).toLocaleTimeString(),
      maxTime: new Date(this._eventEdit._timeFinishEvent).toLocaleTimeString(),
    });
    this._eventEditFinishTime = flatpickr(this._eventEdit.getElement().querySelector(`#event-end-time-1`), {
      defaultDate: new Date(this._eventEdit._timeFinishEvent),
      altInput: true,
      altFormat: `Y/m/d H:i`,
      dateFormat: `Y/m/d H:i`,
      minDate: new Date(this._eventEdit._timeFinishEvent),
      enableTime: true,
      minTime: new Date(this._eventEdit._timeFinishEvent).toLocaleTimeString(),
      maxTime: `23:59`,
    });

    this.init(mode);
  }

  init(createMode) {
    let renderPosition = `beforeend`;
    let currentView = this._event;

    if (createMode === Mode.ADDING) {
      currentView = this._eventEdit;
      renderPosition = `afterbegin`;
    }

    flatpickr(this._eventEdit.getElement().querySelector(`#event-start-time-1`), {
      defaultDate: new Date(this._eventEdit._timeStartEvent),
      altInput: true,
      altFormat: `Y/m/d H:i`,
      dateFormat: `Y/m/d H:i`,
      minDate: new Date(this._eventEdit._timeStartEvent),
      enableTime: true,
      minTime: new Date(this._eventEdit._timeStartEvent).toLocaleTimeString(),
      maxTime: `23:59`,
    });

    const onEventEditEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        if (createMode === Mode.DEFAULT) {
          if (this._container.getElement().contains(this._eventEdit.getElement())) {
            this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
          }
        } else if (createMode === Mode.ADDING) {
          this._container.removeChild(currentView.getElement());

          currentView.getElement()
            .querySelector(`.event__reset-btn`)
            .addEventListener(`click`, () => {
              this._onDataChange(null, null);
            });
        }

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

    const onTypeClick = (evt) => {
      const target = evt.target;

      if (!target.className.includes(`event__type-label`)) {
        return;
      }

      const typeTitle = target.innerText;
      const typeInput = target.parentElement.querySelector(`.event__type-input`);
      const valueTypeInput = typeInput.value;
      let eventTypeIconSrc = this._eventEdit.getElement().querySelector(`.event__type-icon`);
      let eventTypeOutputTitle = this._eventEdit.getElement().querySelector(`.event__type-output`);
      const offerContainer = this._eventEdit.getElement().querySelector(`.event__section--offers`);
      const detailsContainer = this._eventEdit.getElement().querySelector(`.event__details`);
      const newOffers = createElement(this._eventEdit.getEventOffers(new Set(getOffers())));

      eventTypeIconSrc.src = `./img/icons/${valueTypeInput}.png`;
      eventTypeOutputTitle.innerText = typeTitle;

      if (offerContainer && newOffers) {
        unrenderComponent(offerContainer);
        renderComponent(detailsContainer, newOffers, `afterbegin`);
      } else if (!offerContainer && newOffers) {
        renderComponent(detailsContainer, newOffers, `afterbegin`);
      } else if (!newOffers && offerContainer) {
        unrenderComponent(offerContainer);
      }

      this._eventEdit.getElement().querySelector(`.event__type-toggle`).checked = false;
    };

    const onDestinationChange = () => {
      const descriptionContainer = this._eventEdit.getElement().querySelector(`.event__destination-description`);
      descriptionContainer.innerHTML = getRandomDescription();
    };

    this._event.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEventRollupButtonClick);

    this._eventEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEventEditRollupButtonClick);

    this._eventEdit.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`click`, onTypeClick, true);

    this._eventEdit.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, onDestinationChange);

    this._eventEdit.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._eventEdit.getElement().querySelector(`.event`));

        const eventImages = Array.from(this._eventEdit.getElement().querySelectorAll(`.event__photo`)).map((image) => image.src);

        const eventOffers = new Set(Array.from(this._eventEdit.getElement().querySelectorAll(`.event__offer-selector`)).map((offer) => ({
          id: offer.querySelector(`.event__offer-checkbox`).name.slice(12),
          title: offer.querySelector(`.event__offer-title`).innerText,
          price: offer.querySelector(`.event__offer-price`).innerText,
          isChecked: offer.querySelector(`.event__offer-checkbox`).checked,
        })));

        const getTypeId = () => {
          const imgSrc = this._eventEdit.getElement().querySelector(`.event__type-icon`).src;

          return imgSrc.substring(imgSrc.lastIndexOf(`/`) + 1, imgSrc.length - 4);
        };

        const entry = {
          type: {
            id: getTypeId(),
            iconSrc: this._eventEdit.getElement().querySelector(`.event__type-icon`).src,
            title: this._eventEdit.getElement().querySelector(`.event__type-output`).innerText,
          },
          city: formData.get(`event-destination`),
          img: eventImages,
          description: this._eventEdit.getElement().querySelector(`.event__destination-description`).innerText,
          time: {
            timeStartEvent: Date.parse(formData.get(`event-start-time`)),
            timeFinishEvent: Date.parse(formData.get(`event-end-time`)),
          },
          price: Number(formData.get(`event-price`)),
          offers: eventOffers,
        };

        this._onDataChange(entry, (createMode === Mode.DEFAULT) ? this._data : null);

        this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
      });


    this._eventEdit.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        this._onDataChange(null, this._data);
      });

    renderComponent(this._container, currentView.getElement(), renderPosition);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }
}

