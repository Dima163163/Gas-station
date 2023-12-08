import {Column} from './column';
import {RendeerStation} from './renderStation';

export class Station {
  #queue = [];
  #filling = [];
  #ready = [];
  constructor(typeStation, renderApp = null, count = 1, speed = 5) {
    this.typeStation = typeStation;
    this.renderApp = renderApp;
    this.countStation = count;
    this.speedStation = speed;
    this.RendeerStation = null;
  }

  get filling() {
    return this.#filling;
  }

  get queue() {
    return this.#queue;
  }

  optionStation() {
    for (const optionStation of this.typeStation) {
      for (let i = 0; i < this.countStation; i++) {
        this.#filling.push(new Column(optionStation.type, this.speedStation));
      }
    }
  }

  render() {
    if (this.renderApp) {
      this.renderStation = new RendeerStation(this.renderApp, this);
    }
  }

  init() {
    this.optionStation();
    this.render();

    setInterval(() => {
      this.checkQueueToFilling();
    }, 2000);
  }
  checkQueueToFilling() {
    if (this.#queue.length) {
      for (let i = 0; i < this.#queue.length; i++) {
        for (let j = 0; j < this.#filling.length; j++) {
          if (!this.#filling[j].car &&
          this.#queue[i].typeFuel === this.#filling[j].type) {
            this.#filling[j].car = this.#queue.splice(i, 1)[0];
            this.fillingGo(this.#filling[j]);
            this.renderStation.rendeerStation();
            break;
          }
        }
      }
    }
  }

  fillingGo(column) {
    const car = column.car;
    const needPetrol = car.needPetrol;
    let nowTank = car.nowTank;
    const timerId = setInterval(() => {
      nowTank += column.speed;
      if (nowTank >= car.maxTank) {
        clearInterval(timerId);
        const total = car.nowTank - needPetrol;
        car.fillUp();
        column.car = null;
        this.leaveClient({car, total});
      }
    }, 1000);
    console.log(`заправляем ${JSON.stringify(column.car)}`);
  }

  leaveClient({car, total}) {
    this.#ready.push(car);
    this.renderStation.rendeerStation();
  }

  addCarQueue(car) {
    this.#queue.push(car);
    this.renderStation.rendeerStation();
  }
}
