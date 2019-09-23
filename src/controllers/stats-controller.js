import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {types} from '../data';
import moment from "moment";

export default class StatsController {
  constructor(container, events) {
    this._events = events;
    this._container = container;
    this._moneyStats = this._container.querySelector(`.statistics__chart--money`);
    this._transportStats = this._container.querySelector(`.statistics__chart--transport`);
    this._timeStats = this._container.querySelector(`.statistics__chart--time`);

    this.init();
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  setMoneyStats() {
    const ctx = this._moneyStats.getContext(`2d`);
    const gradient = ctx.createLinearGradient(0, 0, 0, 900);
    gradient.addColorStop(0, `rgb(250, 67, 201)`);
    gradient.addColorStop(1, `rgb(186, 67, 250)`);

    const getLabelsValues = (sortedEvents) => {
      let eventsResult = [];
      for (let [, value] of Object.entries(sortedEvents)) {
        const sumValue = value.reduce((acc, val) => acc + val.price, 0);

        eventsResult.push(sumValue);
      }

      return eventsResult;
    };

    const initMoneyStats = new Chart(this._moneyStats, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(this.typeLabels),
        datasets: [{
          label: ``,
          backgroundColor: gradient,
          data: getLabelsValues(this.typeLabels),
        }]
      },
      options: {
        layout: {
          padding: {
            left: 50,
          }
        },
        plugins: {
          datalabels: {
            color: `black`,
            font: {
              size: 14,
            },
            formatter(value) {
              return `€ ${value}`;
            },
            anchor: `end`,
            align: `left`,
          }
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: `MONEY`,
              fontColor: `black`,
              fontSize: 20,
            },
          }]
        }
      },
    });
    initMoneyStats.update();
  }

  setTransportStats() {
    const ctx = this._transportStats.getContext(`2d`);
    const gradient = ctx.createLinearGradient(0, 0, 0, 900);
    gradient.addColorStop(0, `rgb(191, 185, 0)`);
    gradient.addColorStop(1, `rgb(102, 191, 6)`);

    let transferMap;
    for (let [, value] of Object.entries(types)) {
      transferMap = value.transfer.map((type) => type.id.toUpperCase());
    }

    const labels = this._events.reduce((acc, value) => {

      const id = value.type.id.toUpperCase();

      if (transferMap.some((type) => type === id)) {
        if (!acc[id]) {
          acc[id] = [];
        }

        acc[id].push(value);
      }
      return acc;
    }, {});

    const getLabelsValues = (sortedEvents) => {
      let eventsResult = [];
      for (let [, value] of Object.entries(sortedEvents)) {

        eventsResult.push(value.length);
      }

      return eventsResult;
    };

    const initTransportStats = new Chart(this._transportStats, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(labels),
        datasets: [{
          label: ``,
          backgroundColor: gradient,
          data: getLabelsValues(labels),
        }]
      },
      options: {
        layout: {
          padding: {
            left: 50,
          }
        },
        plugins: {
          datalabels: {
            color: `#000000`,
            font: {
              size: 14,
            },
            formatter(value) {
              return `${value}x`;
            },
            anchor: `end`,
            align: `left`,
          }
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: `TRANSPORT`,
              fontColor: `black`,
              fontSize: 20,
            },
          }]
        }
      },
    });
    initTransportStats.update();
  }

  setTimeSpentStats() {
    const ctx = this._moneyStats.getContext(`2d`);
    const gradient = ctx.createLinearGradient(0, 0, 0, 900);
    gradient.addColorStop(0, `rgb(16, 146, 205)`);
    gradient.addColorStop(1, `rgb(227, 13, 112)`);

    const getLabelsValues = (sortedEvents) => {
      let eventsResult = [];
      for (let [, value] of Object.entries(sortedEvents)) {
        const sumValue = value.reduce((acc, val) => {
          const diffTime = Math.abs(val.time.timeFinishEvent - val.time.timeStartEvent);
          return acc + diffTime;
        }, 0);

        eventsResult.push(sumValue);
      }

      return eventsResult;
    };

    const getFormatingTime = (time) => {
      const days = moment.utc(time).format(`D`);
      const hours = moment.utc(time).format(`H[H]`);
      const minutes = moment.utc(time).format(`mm[M]`);
      return {
        days: days !== `1` ? `${Number(days) - 1}D` : ``,
        hours: hours !== `0H` ? hours : ``,
        minutes: minutes !== `00M` ? minutes : ``,
      };
    };

    const initTimeSpentStats = new Chart(this._timeStats, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(this.typeLabels),
        datasets: [{
          label: ``,
          backgroundColor: gradient,
          data: getLabelsValues(this.typeLabels),
        }]
      },
      options: {
        layout: {
          padding: {
            left: 50,
          }
        },
        plugins: {
          datalabels: {
            color: `black`,
            font: {
              size: 14,
            },
            formatter(value) {
              return `${getFormatingTime(value).days} ${getFormatingTime(value).hours} ${getFormatingTime(value).minutes}`;
            },
            anchor: `end`,
            align: `right`,
          }
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: `TIME SPENT`,
              fontColor: `black`,
              fontSize: 20,
            },
          }]
        }
      },
    });
    initTimeSpentStats.update();
  }

  init() {
    this.setMoneyStats();
    this.setTransportStats();
    this.setTimeSpentStats();
  }

  get typeLabels() {
    return this._events.reduce((acc, value) => {

      const id = value.type.id.toUpperCase();

      if (!acc[id]) {
        acc[id] = [];
      }

      acc[id].push(value);

      return acc;
    }, {});
  }
}

