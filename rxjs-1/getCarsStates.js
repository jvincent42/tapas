const { fromEvent } = require('rxjs');
const { filter, takeUntil } = require('rxjs/operators');


const getCarStates = (race, carName) => fromEvent(race, 'data').pipe(
  filter(x => x.carName === carName),
  takeUntil(fromEvent(race, 'end'))
);


module.exports = {
  getCarStates
};