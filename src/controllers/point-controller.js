import Event from "../components/event";
import EventEdit from "../components/eventEdit";
import {renderComponent} from "../utils/util";

export default class PointController {
  constructor(container, event, onDataChange, onChangeView) {
    this._container = container;
    this._event = event;
  }

  init() {
    const event = new Event(this._event);
    const eventEdit = new EventEdit(this._event);

    const onEventEditEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.replaceChild(event.getElement(), eventEdit.getElement());
        document.removeEventListener(`keydown`, onEventEditEscKeyDown);
      }
    };

    const onEventRollupButtonClick = (evt) => {
      evt.preventDefault();
      this._container.replaceChild(eventEdit.getElement(), event.getElement());
      document.addEventListener(`keydown`, onEventEditEscKeyDown);
      event.getElement().removeEventListener(`click`, onEventRollupButtonClick);
    };

    const onEventEditRollupButtonClick = (evt) => {
      evt.preventDefault();
      this._container.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEventEditEscKeyDown);
      eventEdit.getElement().removeEventListener(`click`, onEventEditRollupButtonClick);
    };

    const onEventEditSubmit = onEventEditRollupButtonClick;

    event.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEventRollupButtonClick);

    eventEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEventEditRollupButtonClick);

    eventEdit.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, onEventEditSubmit);

    renderComponent(this._container, event.getElement(), `beforeend`);
  }
}

