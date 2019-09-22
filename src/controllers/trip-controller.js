import Info from "../components/info";
import {createElement, getSortEventList, renderComponent, unrenderComponent} from "../utils/util";
import Day from "../components/day";
import Sort from "../components/sort";
import Days from "../components/days";
import PointController from "./point-controller";
import {Mode} from "../data";

export default class TripController {
  constructor(events) {
    this._events = events.slice();
    this._sort = new Sort();
    this._days = new Days();
    this._info = new Info(this._events);
    this._tripEventsContainer = document.querySelector(`.trip-events`);
    this._uniqueEvents = this.getUniqueEventsList(this.getSortedDays(this._events));
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._creatingEvent = null;
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
    if (this._creatingEvent) {
      return;
    }

    const defaultEvent = {
      type: {
        iconSrc: ``,
        title: ``,
      },
      city: ``,
      img: [],
      description: ``,
      time: {
        timeStartEvent: new Date(),
        timeFinishEvent: new Date(),
      },
      price: 0,
      offers: new Set(),
    };

    this._creatingEvent = new PointController(this._days.getElement(), Mode.ADDING, defaultEvent, this._onDataChange, this._onChangeView);

  }

  init() {
    const tripEvents = document.querySelector(`.trip-events > h2`);
    const tripInfo = document.querySelector(`.trip-info`);
    const noEventsMarkup = `<p class="trip-events__msg">Click New Event to create your first point</p>`;

    if (this._events.length) {
      renderComponent(tripEvents, this._days.getElement());
      renderComponent(tripEvents, this._sort.getElement());
      renderComponent(tripInfo, this._info.getElement(), `afterbegin`);
      this._sort.getElement().addEventListener(`click`, this._onSortButtonClick.bind(this), true);
      this._renderDays(this._uniqueEvents);
      this.getSumCostTrip(this._events);
    } else {
      renderComponent(tripEvents, createElement(noEventsMarkup));
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
        this._renderDays(this._uniqueEvents);
        break;
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onDataChange(newEvent, oldEvent) {
    const indexEvent = this._events.findIndex((event) => event === oldEvent);
    if (newEvent === null && oldEvent === null) {
      this._creatingEvent = null;
    } else if (newEvent === null) {
      this._events = [...this._events.slice(0, indexEvent), ...this._events.slice(indexEvent + 1)];
    } else if (oldEvent === null) {
      this._creatingEvent = null;
      this._events = [newEvent, ...this._events].slice().sort(getSortEventList);
    } else {
      this._events[indexEvent] = newEvent;
    }

    this._uniqueEvents = this.getUniqueEventsList(this.getSortedDays(this._events));
    this._renderDays(this._uniqueEvents);
    this.getSumCostTrip(this._events);
  }

  _renderEvents(eventsContainer, eventsDay) {
    eventsDay.forEach((event) => {
      const pointController = new PointController(eventsContainer, Mode.DEFAULT, event, this._onDataChange, this._onChangeView);
      this._subscriptions.push(pointController.setDefaultView.bind(pointController));

      return pointController;
    });
  }

  _renderDays(uniqueEvents) {
    const tripEvents = document.querySelector(`.trip-events`);
    if (document.querySelector(`.trip-days`)) {
      unrenderComponent(this._days.getElement());
      this._days.removeElement();
    }
    this._days = new Days();
    renderComponent(tripEvents, this._days.getElement(), `beforeend`);
    uniqueEvents.forEach((uniqueDay, index) => {
      const day = new Day(uniqueDay[0], index + 1);
      renderComponent(this._days.getElement(), day.getElement(), `beforeend`);

      const eventsContainer = day.getElement().querySelector(`.trip-events__list`);
      this._renderEvents(eventsContainer, uniqueDay);
    });
  }
}

