import moment from "moment";
import {types} from "../data";

// Рендерим компонент
const renderComponent = (elementContainer, element, where = `afterend`) => {
  return elementContainer.insertAdjacentElement(where, element);
};

// Анрендер компонента
const unrenderComponent = (element) => {
  if (element) {
    element.remove();
  }
};

const getDurationTime = (timeStart, timeFinish) => {
  let timeStartEvent = timeStart;
  let timeFinishEvent = timeFinish;

  if (typeof timeStart === `string`) {
    timeStartEvent = Number(moment(timeStartEvent).format(`x`));
    timeFinishEvent = Number(moment(timeFinishEvent).format(`x`));
  }
  const diffTime = Math.abs(timeFinishEvent - timeStartEvent);
  const days = moment.utc(timeFinishEvent).diff(moment.utc(timeStartEvent), `days`);
  const hours = moment.utc(diffTime).format(`H[H]`);
  const minutes = moment.utc(diffTime).format(`mm[M]`);

  return {
    days: days !== 0 ? `${days}D` : ``,
    hours: hours !== `0H` ? hours : ``,
    minutes: minutes !== `00M` ? minutes : ``,
  };
};

const getSortEventList = (a, b) => {
  return Date.parse(new Date(a.time.timeStartEvent).toDateString()) - Date.parse(new Date(b.time.timeStartEvent).toDateString());
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};


const transformTypeEvent = (type) => {
  const transferTitle = types.slice()[0].transfers.find(({id}) => id === type);
  const activityTitle = types.slice()[0].activities.find(({id}) => id === type);
  if (transferTitle) {
    return transferTitle.title;
  } else if (activityTitle) {
    return activityTitle.title;
  } else {
    return ``;
  }
};

const transformObjectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export {
  renderComponent,
  unrenderComponent,
  getSortEventList,
  createElement,
  getDurationTime,
  transformTypeEvent,
  transformObjectToArray,
};

