import Event from "../components/event";
import EventEdit from "../components/eventEdit";
import EventAdd from "../components/event-add";
import {renderComponent, createElement, unrenderComponent} from "../utils/util";
import {apiData, Mode} from "../data";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/airbnb.css";
import Api from "../api";

export default class PointController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._event = new Event(this._data);
    this._eventEdit = new EventEdit(this._data);
    this._eventAdd = new EventAdd(this._data);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._api = new Api(apiData);

    this._apiOffers = null;

    this._api.getOffers().then(this._saveOffers.bind(this));
  }

  _saveOffers(offers) {
    this._apiOffers = offers;
  }

  init(createMode) {
    let renderPosition = `beforeend`;
    let currentView = this._event;

    if (createMode === Mode.ADDING) {
      renderPosition = `afterbegin`;
      currentView = this._eventAdd;
    } else if (createMode === Mode.EDIT) {
      renderPosition = `afterbegin`;
      currentView = this._eventEdit;
    }

    const onEventEditEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        if (createMode === Mode.EDIT) {
          if (this._container.contains(currentView.getElement())) {
            this._container.replaceChild(this._event.getElement(), currentView.getElement());
          }
        } else if (createMode === Mode.ADDING) {
          if (this._container.contains(currentView.getElement())) {
            this._container.removeChild(currentView.getElement());
          }
          this._onDataChange({newEvent: null, oldEvent: null});
        }

        if (currentView.getElement().className.includes(`shake`)) {
          currentView.setStyleErrorEventEdit(false);
        }

        document.removeEventListener(`keydown`, onEventEditEscKeyDown);
      }
    };

    const onEventRollupButtonClick = (evt) => {
      evt.preventDefault();
      renderPosition = `afterbegin`;
      currentView = this._eventEdit;
      this._onChangeView();
      unrenderComponent(this._event.getElement());
      const pointController = new PointController(this._container, this._data, this._onDataChange, this._onChangeView);
      pointController.init(Mode.EDIT);
      document.addEventListener(`keydown`, onEventEditEscKeyDown);
      this._event.getElement().removeEventListener(`click`, onEventRollupButtonClick);
    };

    const onEventEditRollupButtonClick = (evt) => {
      evt.preventDefault();
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
      this._eventEdit.setStyleErrorEventEdit(false);
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
      let eventTypeIconSrc = currentView.getElement().querySelector(`.event__type-icon`);
      let eventTypeOutputTitle = currentView.getElement().querySelector(`.event__type-output`);
      const offerContainer = currentView.getElement().querySelector(`.event__section--offers`);
      const detailsContainer = currentView.getElement().querySelector(`.event__details`);
      const offersOfType = this._apiOffers.find(({type}) => valueTypeInput === type);
      const newOffers = offersOfType.offers.length > 1 ?
        createElement(currentView.getOffers(offersOfType.offers.slice(0, 2))) :
        createElement(``);

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

      currentView.getElement().querySelector(`.event__type-toggle`).checked = false;
    };

    const onDestinationChange = (evt) => {
      const city = evt.target.value;
      const destination = currentView.getElement().querySelector(`.event__section-title--destination`);
      if (destination) {
        destination.parentElement.innerHTML = ``;
      }
      currentView
        .getElement()
        .querySelector(`.event__section--destination`)
        .insertAdjacentHTML(`beforeend`, currentView.insertDescription(city));
      currentView
        .getElement()
        .querySelector(`.event__section--destination`)
        .insertAdjacentHTML(`beforeend`, currentView.insertImage(city));
    };

    const onFormInput = (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      if (currentView.getElement().className.includes(`shake`)) {
        currentView.setStyleErrorEventEdit(false);
      } else {
        currentView.getElement()
          .querySelector(`form`)
          .removeEventListener(`input`, onFormInput);
      }
    };

    const onSubmit = (evt) => {
      evt.preventDefault();

      currentView.changeFormUi(true);
      currentView.changeTextOnButton(`Saving`);
      currentView.getElement()
        .querySelector(`form`)
        .addEventListener(`input`, onFormInput);

      const formData = new FormData(currentView.getElement().querySelector(`.event`));

      const eventImages = [...currentView.getElement().querySelectorAll(`.event__photo`)].map((image) => {
        return {
          src: image.src,
          description: image.alt,
        };
      });

      const eventOffers = new Set(Array.from(currentView.getElement().querySelectorAll(`.event__offer-selector`)).map((offer) => ({
        id: offer.querySelector(`.event__offer-checkbox`).name.slice(12),
        title: offer.querySelector(`.event__offer-title`).innerText,
        price: Number(offer.querySelector(`.event__offer-price`).innerText),
        isChecked: offer.querySelector(`.event__offer-checkbox`).checked,
      })));

      const eventOffersToRaw = Array.from(currentView.getElement().querySelectorAll(`.event__offer-selector`)).map((offer) => ({
        title: offer.querySelector(`.event__offer-title`).innerText,
        price: Number(offer.querySelector(`.event__offer-price`).innerText),
        accepted: offer.querySelector(`.event__offer-checkbox`).checked,
      }));

      let eventFavorite = false;
      if (Mode.EDIT) {
        eventFavorite = this._eventEdit.getElement().querySelector(`.event__favorite-checkbox`).checked;
      }

      const getTypeId = () => {
        const imgSrc = currentView.getElement().querySelector(`.event__type-icon`).src;

        return imgSrc.substring(imgSrc.lastIndexOf(`/`) + 1, imgSrc.length - 4);
      };
      const eventCity = currentView.getElement().querySelector(`.event__input--destination`).value;
      const eventPrice = currentView.getElement().querySelector(`.event__input--price`).value;

      const entry = {
        id: currentView.getElement().dataset.eventId,
        type: {
          id: getTypeId(),
          iconSrc: currentView.getElement().querySelector(`.event__type-icon`).src,
          title: currentView.getElement().querySelector(`.event__type-output`).innerText,
        },
        city: eventCity,
        images: eventImages,
        description: currentView.getElement().querySelector(`.event__destination-description`).innerText,
        time: {
          timeStartEvent: Date.parse(formData.get(`event-start-time`)),
          timeFinishEvent: Date.parse(formData.get(`event-end-time`)),
        },
        price: Number(eventPrice),
        offers: eventOffers,
        favorite: eventFavorite,
        get toRAW() {
          return {
            'type': this.type.id,
            'destination': {
              'description': this.description,
              'name': this.city,
              'pictures': this.images,
            },
            'date_from': new Date(this.time.timeStartEvent).toISOString(),
            'date_to': new Date(this.time.timeFinishEvent).toISOString(),
            'base_price': this.price,
            'is_favorite': this.favorite,
            'offers': eventOffersToRaw,
          };
        },
      };

      this._onDataChange({
        newEvent: entry,
        oldEvent: (createMode !== Mode.ADDING) ? this._data : null,
        container: this._container,
        currentEvent: this._event,
        currentView: (createMode === Mode.ADDING) ? this._eventAdd : this._eventEdit,
        mode: createMode});
    };

    document.addEventListener(`keydown`, onEventEditEscKeyDown);

    this._event.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEventRollupButtonClick);

    this._eventEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEventEditRollupButtonClick);

    if (createMode !== Mode.DEFAULT) {
      currentView.getElement()
        .querySelector(`.event__type-list`)
        .addEventListener(`click`, onTypeClick, true);

      currentView.getElement()
        .querySelector(`.event__input--destination`)
        .addEventListener(`change`, onDestinationChange);

      currentView.getElement()
        .querySelector(`form`)
        .addEventListener(`input`, onFormInput);

      currentView.getElement()
        .querySelector(`form`)
        .addEventListener(`submit`, onSubmit);

      // this._eventEdit.getElement()
      //   .querySelector(`form`)
      //   .addEventListener(`submit`, onSubmit);
      //
      // this._eventAdd.getElement()
      //   .querySelector(`form`)
      //   .addEventListener(`submit`, onSubmit);

      currentView.getElement()
        .querySelector(`.event__reset-btn`)
        .addEventListener(`click`, (evt) => {
          evt.preventDefault();
          if (createMode === Mode.ADDING) {
            this._container.removeChild(currentView.getElement());
            this._onDataChange(
                {
                  newEvent: null,
                  oldEvent: null
                });
          } else if (createMode === Mode.EDIT) {
            this._eventEdit.changeTextOnButton(`Deleting`);
            this._onDataChange(
                {
                  newEvent: null,
                  oldEvent: this._data,
                  currentView: this._eventEdit
                });
          }
        });
    }

    this._eventEdit.getElement()
      .querySelector(`#event-favorite-1`)
      .addEventListener(`change`, onSubmit);


    renderComponent(this._container, currentView.getElement(), renderPosition);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }
}

