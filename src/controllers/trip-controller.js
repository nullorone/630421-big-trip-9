import Info from "../components/info";
import {createElement, getSortEventList, renderComponent, unrenderComponent} from "../utils/util";
import Day from "../components/day";
import Sort from "../components/sort";
import Days from "../components/days";
import Stats from "../components/stats";
import PointController from "./point-controller";
import {apiData, Mode} from "../data";
import Api from "../api";
import ModelEvent from "../model/model-event";
import StatsController from "./stats-controller";
import FilterController from "./filter-controller";

export default class TripController {
  constructor() {
    this._events = null;
    this._sort = new Sort();
    this._days = new Days();
    this._stats = new Stats();
    this._filterController = new FilterController(this._onFilterChange.bind(this));
    this._tripEventsContainer = document.querySelector(`.trip-events`);
    this._uniqueEvents = null;
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._creatingEvent = null;
    this._api = new Api(apiData);
  }

  // Получаем объект с ключом - день:number и значением - евенты:[]
  getSortedDays(unsortedEvents) {
    return unsortedEvents.reduce((acc, value) => {

      const date = Date.parse(new Date(value.time.timeStartEvent).toDateString());
      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(value);

      return acc;
    }, {});
  }

  // Получаем двумерный массив с евентами
  getUniqueEventsList(sortedEvents) {
    let eventsResult = [];
    for (let [, value] of Object.entries(sortedEvents)) {
      eventsResult.push(value);
    }

    return eventsResult;
  }

  getSumCostTrip(events) {
    const sumCost = document.querySelector(`.trip-info__cost-value`);
    sumCost.textContent = events.map(({price}) => Number(price)).reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  hide() {
    this._tripEventsContainer.classList.add(`visually-hidden`);
  }

  show() {
    this._tripEventsContainer.classList.remove(`visually-hidden`);
  }

  createEvent() {
    this._onChangeView();
    if (this._creatingEvent) {
      return;
    }

    const defaultEvent = {
      id: 0,
      type: {
        id: ``,
        iconSrc: ``,
        title: ``,
      },
      city: ``,
      images: [],
      description: ``,
      time: {
        timeStartEvent: new Date(),
        timeFinishEvent: new Date(),
      },
      price: 0,
      offers: new Set(),
    };

    this._creatingEvent = new PointController(this._days.getElement(), defaultEvent, this._onDataChange, this._onChangeView);
    this._creatingEvent.init(Mode.ADDING);
  }

  renderDays(uniqueEvents) {
    if (document.querySelector(`.trip-days`)) {
      unrenderComponent(this._days.getElement());
      this._days.removeElement();
    }
    this._days = new Days();
    renderComponent(this._tripEventsContainer, this._days.getElement(), `beforeend`);
    uniqueEvents.forEach((uniqueDay, index) => {
      const day = new Day(uniqueDay[0], index + 1);
      renderComponent(this._days.getElement(), day.getElement(), `beforeend`);

      const eventsContainer = day.getElement().querySelector(`.trip-events__list`);
      this._renderEvents(eventsContainer, uniqueDay);
    });
  }

  init(events) {
    this._events = events;
    this._uniqueEvents = this.getUniqueEventsList(this.getSortedDays(events.slice()));
    const tripEvents = document.querySelector(`.trip-events > h2`);
    const tripInfo = document.querySelector(`.trip-info`);
    const noEventsMarkup = `<p class="trip-events__msg">Click New Event to create your first point</p>`;
    const info = new Info(this._events.slice());

    if (this._events.length) {
      renderComponent(tripEvents, this._days.getElement());
      renderComponent(tripEvents, this._sort.getElement());
      renderComponent(tripInfo, info.getElement(), `afterbegin`);
      renderComponent(this._tripEventsContainer, this._stats.getElement(), `afterend`);
      this._sort.getElement().addEventListener(`click`, this._onSortButtonClick.bind(this), true);
      this._filterController.init(this._uniqueEvents);
      this.renderDays(this._uniqueEvents);
      this.getSumCostTrip(this._events);
      document.querySelector(`.trip-tabs`).addEventListener(`click`, this._onTripTabsClick.bind(this), true);

      this._stats.getElement().classList.add(`visually-hidden`);
    } else {
      renderComponent(tripEvents, createElement(noEventsMarkup));
    }
  }

  _onFilterChange(filteredEvents) {
    this._days.getElement().innerHTML = ``;
    this.renderDays(filteredEvents);
  }

  _onTripTabsClick(evt) {
    const target = evt.target;
    const isActiveTarget = target.className.includes(`trip-tabs__btn--active`);
    const statsController = new StatsController(this._stats.getElement(), this._events);

    switch (true) {
      case (target.innerText === `Stats` && !isActiveTarget):
        target.classList.add(`trip-tabs__btn--active`);
        target.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
        statsController.show();
        this.hide();
        break;
      case (target.innerText === `Table` && !isActiveTarget):
        target.classList.add(`trip-tabs__btn--active`);
        target.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
        statsController.hide();
        this.show();
        break;
    }
  }

  _onSortButtonClick(evt) {
    evt.preventDefault();
    const target = evt.target;

    if (target.className !== `trip-sort__btn`) {
      return;
    }

    const input = target.parentElement.querySelector(`.trip-sort__input`);
    const day = new Day().getElement();

    input.checked = true;
    this._days.getElement().innerHTML = ``;

    switch (input.dataset.type) {
      case (`time`):
        const getDurationEvent = (event) => Math.abs(event.time.timeFinishEvent - event.time.timeStartEvent);
        const sortedByDurationEvents = this._events.slice().sort((a, b) => getDurationEvent(b) - getDurationEvent(a));
        renderComponent(this._days.getElement(), day, `beforeend`);
        this._renderEvents(day.querySelector(`.trip-events__list`), sortedByDurationEvents);
        break;
      case (`price`):
        const sortedByPriceEvents = this._events.slice().sort((a, b) => b.price - a.price);
        renderComponent(this._days.getElement(), day, `beforeend`);
        this._renderEvents(day.querySelector(`.trip-events__list`), sortedByPriceEvents);
        break;
      default:
        this.renderDays(this._uniqueEvents);
        break;
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onDataChange({newEvent, oldEvent, container, currentEvent, currentView, mode}) {
    const indexEvent = this._events.findIndex((event) => event === oldEvent);
    if (newEvent === null && oldEvent === null) {
      this._creatingEvent = null;
      document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    } else if (newEvent === null) {
      this._api.deleteEvent(oldEvent)
        .then(() => this._api.getPoints())
        .then(ModelEvent.parseEvents)
        .then((events) => {
          if (currentView.getElement().className.includes(`shake`)) {
            currentView.setStyleErrorEventEdit(false);
          }
          this._creatingEvent = null;
          this._events = events;
          this._uniqueEvents = this.getUniqueEventsList(this.getSortedDays(this._events));
          this.renderDays(this._uniqueEvents);
          this._filterController.init(this._uniqueEvents);
          this.getSumCostTrip(this._events);
        })
        .catch(() => {
          currentView.changeFormUi(false);
          currentView.changeTextOnButton(`Delete`);
          currentView.setStyleErrorEventEdit(true);
        });
    } else if (mode === Mode.ADDING) {
      this._creatingEvent = null;
      this._api.createEvent(newEvent)
        .then((event) => {
          if (currentView.getElement().className.includes(`shake`)) {
            currentView.setStyleErrorEventEdit(false);
          }
          this._events = [event, ...this._events].slice().sort(getSortEventList);
          this._uniqueEvents = this.getUniqueEventsList(this.getSortedDays(this._events));
          this.renderDays(this._uniqueEvents);
          this._filterController.init(this._uniqueEvents);
          this.getSumCostTrip(this._events);
          container.replaceChild(currentEvent.getElement(), currentView.getElement());

          document.querySelector(`.trip-main__event-add-btn`).disabled = false;
        })
        .catch(() => {
          currentView.changeFormUi(false);
          currentView.changeTextOnButton(`Save`);
          currentView.setStyleErrorEventEdit(true);
        });
    } else if (mode === Mode.EDIT) {
      this._api.updateEvent(newEvent)
        .then((event) => {
          if (currentView.getElement().className.includes(`shake`)) {
            currentView.setStyleErrorEventEdit(false);
          }
          this._events[indexEvent] = event;
          this._uniqueEvents = this.getUniqueEventsList(this.getSortedDays(this._events));
          this.renderDays(this._uniqueEvents);
          this._filterController.init(this._uniqueEvents);
          this.getSumCostTrip(this._events);
          container.replaceChild(currentEvent.getElement(), currentView.getElement());
        }).catch(() => {
          currentView.changeFormUi(false);
          currentView.changeTextOnButton(`Save`);
          currentView.setStyleErrorEventEdit(true);
        });
    }
  }

  _renderEvents(eventsContainer, eventsDay) {
    eventsDay.forEach((event) => {
      const pointController = new PointController(eventsContainer, event, this._onDataChange, this._onChangeView);
      pointController.init(Mode.DEFAULT);
      this._subscriptions.push(pointController.setDefaultView.bind(pointController));

      return pointController;
    });
  }
}

