import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {types} from '../data';
import moment from "moment";

const MONEY_LAYOUT_PADDING_LEFT = 50;
const MONEY_DATALABELS_FONT_SIZE = 14;
const MONEY_YAXES_SCALELABEL_FONT_SIZE = 20;
const TRANSPORT_LAYOUT_PADDING_LEFT = MONEY_LAYOUT_PADDING_LEFT;
const TRANSPORT_DATALABELS_FONT_SIZE = MONEY_DATALABELS_FONT_SIZE;
const TRANSPORT_YAXES_SCALELABEL_FONT_SIZE = MONEY_YAXES_SCALELABEL_FONT_SIZE;
const TIMESPENT_LAYOUT_PADDING_LEFT = MONEY_LAYOUT_PADDING_LEFT;
const TIMESPENT_DATALABELS_FONT_SIZE = MONEY_DATALABELS_FONT_SIZE;
const TIMESPENT_YAXES_SCALELABEL_FONT_SIZE = MONEY_YAXES_SCALELABEL_FONT_SIZE;

const GradientParameters = {
  X0: 0,
  Y0: 0,
  X1: 0,
  Y1: 900,
};

const GradientMoneyColorParameters = {
  START: {
    OFFSET: 0,
    COLOR: `rgb(250, 67, 201)`,
  },
  FINISH: {
    OFFSET: 1,
    COLOR: `rgb(186, 67, 250)`,
  }
};

const GradientTransportColorParameters = {
  START: {
    OFFSET: 0,
    COLOR: `rgb(191, 185, 0)`,
  },
  FINISH: {
    OFFSET: 1,
    COLOR: `rgb(102, 191, 6)`,
  }
};

const GradientTimeSpentColorParameters = {
  START: {
    OFFSET: 0,
    COLOR: `rgb(16, 146, 205)`,
  },
  FINISH: {
    OFFSET: 1,
    COLOR: `rgb(227, 13, 112)`,
  }
};

export default class StatsController {
  constructor(container, events) {
    this._events = events;
    this._container = container;
    this._moneyStats = this._container.querySelector(`.statistics__chart--money`);
    this._transportStats = this._container.querySelector(`.statistics__chart--transport`);
    this._timeStats = this._container.querySelector(`.statistics__chart--time`);

    this.init();
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

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  setMoneyStats() {
    const ctx = this._moneyStats.getContext(`2d`);
    const gradient = ctx.createLinearGradient(GradientParameters.X0, GradientParameters.Y0, GradientParameters.X1, GradientParameters.Y1);
    gradient.addColorStop(GradientMoneyColorParameters.START.OFFSET, GradientMoneyColorParameters.START.COLOR);
    gradient.addColorStop(GradientMoneyColorParameters.FINISH.OFFSET, GradientMoneyColorParameters.FINISH.COLOR);

    const getLabelsValues = (sortedEvents) => {
      const eventsResult = [];
      for (const [, value] of Object.entries(sortedEvents)) {
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
            left: MONEY_LAYOUT_PADDING_LEFT,
          }
        },
        plugins: {
          datalabels: {
            color: `black`,
            font: {
              size: MONEY_DATALABELS_FONT_SIZE,
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
              fontSize: MONEY_YAXES_SCALELABEL_FONT_SIZE,
            },
          }]
        }
      },
    });
    initMoneyStats.update();
  }

  setTransportStats() {
    const ctx = this._transportStats.getContext(`2d`);
    const gradient = ctx.createLinearGradient(GradientParameters.X0, GradientParameters.Y0, GradientParameters.X1, GradientParameters.Y1);
    gradient.addColorStop(GradientTransportColorParameters.START.OFFSET, GradientTransportColorParameters.START.COLOR);
    gradient.addColorStop(GradientTransportColorParameters.FINISH.OFFSET, GradientTransportColorParameters.FINISH.COLOR);

    let transferMap;
    for (const [, value] of Object.entries(types)) {
      transferMap = value.transfers.map((type) => type.id.toUpperCase());
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
      const eventsResult = [];
      for (const [, value] of Object.entries(sortedEvents)) {

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
            left: TRANSPORT_LAYOUT_PADDING_LEFT,
          }
        },
        plugins: {
          datalabels: {
            color: `black`,
            font: {
              size: TRANSPORT_DATALABELS_FONT_SIZE,
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
              fontSize: TRANSPORT_YAXES_SCALELABEL_FONT_SIZE,
            },
          }]
        }
      },
    });
    initTransportStats.update();
  }

  setTimeSpentStats() {
    const ctx = this._moneyStats.getContext(`2d`);
    const gradient = ctx.createLinearGradient(GradientParameters.X0, GradientParameters.Y0, GradientParameters.X1, GradientParameters.Y1);
    gradient.addColorStop(GradientTimeSpentColorParameters.START.OFFSET, GradientTimeSpentColorParameters.START.COLOR);
    gradient.addColorStop(GradientTimeSpentColorParameters.FINISH.OFFSET, GradientTimeSpentColorParameters.FINISH.COLOR);

    const getLabelsValues = (sortedEvents) => {
      const eventsResult = [];
      for (const [, value] of Object.entries(sortedEvents)) {
        const sumValue = value.reduce((acc, val) => {
          const diffTime = Math.abs(moment(val.time.timeFinishEvent) - moment(val.time.timeStartEvent));
          return acc + diffTime;
        }, 0);

        eventsResult.push(sumValue);
      }

      return eventsResult;
    };

    const getFormattingTime = (time) => {
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
            left: TIMESPENT_LAYOUT_PADDING_LEFT,
          }
        },
        plugins: {
          datalabels: {
            color: `black`,
            font: {
              size: TIMESPENT_DATALABELS_FONT_SIZE,
            },
            formatter(value) {
              return `${getFormattingTime(value).days} ${getFormattingTime(value).hours} ${getFormattingTime(value).minutes}`;
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
              fontSize: TIMESPENT_YAXES_SCALELABEL_FONT_SIZE,
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


}

