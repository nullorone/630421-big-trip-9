import Event from "../components/event";
import EventEdit from "../components/event-edit";
import EventAdd from "../components/event-add";
import {renderComponent, createElement, unrenderComponent} from "../utils/util";
import {apiSettings, Mode} from "../data";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/airbnb.css";
import Api from "../api";
import {OFFERS_LIMIT} from "../components/event";

const INDEX_OFFER_NAME = 12;

export default class PointController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._event = new Event(this._data);
    this._eventEdit = new EventEdit(this._data);
    this._eventAdd = new EventAdd(this._data);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._api = new Api(apiSettings);

    this._apiOffers = null;

    this._api.getOffers().then(this._saveOffers.bind(this));
  }

  init(createMode) {
    let renderPosition = `beforeend`;
    let currentView = this._event;

    if (createMode === Mode.ADDING) {
      renderPosition = `afterbegin`;
      currentView = this._eventAdd;
    }

    const onEventEditEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        if (currentView === this._eventEdit) {
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
      const tripDays = document.querySelector(`.trip-days`);

      if (tripDays.firstElementChild.dataset.eventId === `0`) {
        tripDays.removeChild(tripDays.firstElementChild);
        this._onDataChange({newEvent: null, oldEvent: null});
      }


      this._onChangeView();
      this._container.replaceChild(this._eventEdit.getElement(), this._event.getElement());
      setListeners(Mode.EDIT);
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
      const eventTypeIconSrc = currentView.getElement().querySelector(`.event__type-icon`);
      const eventTypeOutputTitle = currentView.getElement().querySelector(`.event__type-output`);
      const offerContainer = currentView.getElement().querySelector(`.event__section--offers`);
      const detailsContainer = currentView.getElement().querySelector(`.event__details`);
      const offersOfType = this._apiOffers.find(({type}) => valueTypeInput === type);
      const newOffers = offersOfType.offers.length > 1 ?
        createElement(currentView.getEventOffers(new Set(offersOfType.offers.slice(0, OFFERS_LIMIT)))) :
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

    const onOffersClick = (evt) => {
      const currentOffer = evt.target;
      if (!currentOffer.className.includes(`event__offer-checkbox`)) {
        return;
      }
      const sumCost = document.querySelector(`.trip-info__cost-value`);
      const currentOfferValue = Number(currentOffer.parentElement.querySelector(`.event__offer-price`).innerText);
      let cost = Number(sumCost.innerText);

      if (currentOffer.checked) {
        cost = cost + currentOfferValue;
      } else {
        cost = cost - currentOfferValue;
      }
      sumCost.innerHTML = cost.toString();
    };

    const onDestinationChange = (evt) => {
      evt.preventDefault();
      const target = evt.target;
      const city = target.value;
      const destination = currentView.getElement().querySelector(`.event__section-title--destination`);
      const destinationList = currentView.getElement().querySelector(`#destination-list-1`);
      const destinationOptions = [...destinationList.options].map((option) => option.value);
      const hasDestination = destinationOptions.some((destinationOption) => city === destinationOption);

      const onDestinationInvalid = () => {
        evt.preventDefault();
        target.value = ``;
        target.removeEventListener(`invalid`, onDestinationInvalid);
      };

      const insertDestinationInfo = (cityName) => {
        return `${currentView.insertDescription(cityName)} ${currentView.insertImage(cityName)}`;
      };

      target.addEventListener(`invalid`, onDestinationInvalid);

      if (destination) {
        destination.parentElement.innerHTML = ``;
      }

      if (hasDestination) {
        currentView
          .getElement()
          .querySelector(`.event__section--destination`)
          .insertAdjacentHTML(`beforeend`, insertDestinationInfo(city));
        target.setCustomValidity(``);
      } else {
        target.setCustomValidity(`Select a destination from the list.`);
      }
    };

    const onFormInput = (evt) => {
      evt.preventDefault();
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
        id: offer.querySelector(`.event__offer-checkbox`).name.slice(INDEX_OFFER_NAME),
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
      if (currentView === this._eventEdit) {
        eventFavorite = this._eventEdit.getElement().querySelector(`.event__favorite-checkbox`).checked;
      }

      const getTypeId = () => {
        const imgSrc = currentView.getElement().querySelector(`.event__type-icon`).src;

        return imgSrc.substring(imgSrc.lastIndexOf(`/`) + 1, imgSrc.lastIndexOf(`.`));
      };
      const eventCity = currentView.getElement().querySelector(`.event__input--destination`).value;
      const eventPrice = currentView.getElement().querySelector(`.event__input--price`).value;
      const eventDescription = currentView.getElement().querySelector(`.event__destination-description`);
      const eventTypeTitle = currentView.getElement().querySelector(`.event__type-output`);

      const entry = {
        id: currentView.getElement().dataset.eventId,
        type: {
          id: getTypeId(),
          iconSrc: currentView.getElement().querySelector(`.event__type-icon`).src,
          title: eventTypeTitle ? eventTypeTitle.innerText : ``,
        },
        city: eventCity,
        images: eventImages,
        description: eventDescription ? eventDescription.innerText : ``,
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
        oldEvent: (currentView === this._eventEdit) ? this._data : null,
        container: this._container,
        currentEvent: this._event,
        currentView: (createMode === Mode.ADDING) ? this._eventAdd : this._eventEdit,
        mode: (createMode === Mode.ADDING) ? Mode.ADDING : Mode.EDIT});
    };

    const setListeners = (modeEvent) => {
      const typeEvent = modeEvent === Mode.ADDING ? this._eventAdd : this._eventEdit;

      if (typeEvent.getElement()
        .querySelector(`.event__available-offers`)) {
        typeEvent.getElement()
          .querySelector(`.event__available-offers`)
          .addEventListener(`change`, onOffersClick, true);
      }

      const priceInput = typeEvent.getElement().querySelector(`.event__input--price`);

      priceInput.addEventListener(`input`, function (evt) {
        const target = evt.target;
        if ((Number(target.value) ^ 0) !== Number(target.value)) {
          priceInput.setCustomValidity(`Enter an integer and try again`);
        } else {
          priceInput.setCustomValidity(``);
        }
      });

      typeEvent.getElement()
        .querySelector(`.event__type-list`)
        .addEventListener(`click`, onTypeClick, true);

      typeEvent.getElement()
        .querySelector(`.event__input--destination`)
        .addEventListener(`change`, onDestinationChange);

      typeEvent.getElement()
        .querySelector(`form`)
        .addEventListener(`input`, onFormInput);

      typeEvent.getElement()
        .querySelector(`form`)
        .addEventListener(`submit`, onSubmit);

      typeEvent.getElement()
        .querySelector(`.event__reset-btn`)
        .addEventListener(`click`, (evt) => {
          evt.preventDefault();
          if (modeEvent === Mode.ADDING) {
            this._container.removeChild(currentView.getElement());
            this._onDataChange(
                {
                  newEvent: null,
                  oldEvent: null
                });
          } else {
            this._eventEdit.changeTextOnButton(`Deleting`);
            this._onDataChange(
                {
                  newEvent: null,
                  oldEvent: this._data,
                  currentView: this._eventEdit
                });
          }
        });
    };

    document.addEventListener(`keydown`, onEventEditEscKeyDown);

    this._event.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEventRollupButtonClick);

    this._eventEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEventEditRollupButtonClick);

    this._eventEdit.getElement()
      .querySelector(`#event-favorite-1`)
      .addEventListener(`change`, onSubmit);

    if (currentView !== this._event) {
      setListeners(createMode);
    }

    renderComponent(this._container, currentView.getElement(), renderPosition);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }

  _saveOffers(offers) {
    this._apiOffers = offers;
  }
}

