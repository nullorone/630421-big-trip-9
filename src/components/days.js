import Abstract from "./abstract";

export default class Days extends Abstract {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <ul class="trip-days"></ul>`.trim();
  }
}

