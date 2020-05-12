const { fromEvent } = require('rxjs');
const { filter, takeUntil } = require('rxjs/operators');


/**
 * Transforms the race EventEmitter to an Observable and filter events based on the carName property
 * 
 * @param {NodeStyleEventEmitter} race
 * @param {string} carName 
 * @returns {Observable}
 */
const getCarStates = (race, carName) => fromEvent(race, 'data').pipe(
  filter(x => x.carName === carName),
  takeUntil(fromEvent(race, 'end'))
);


module.exports = {
  getCarStates
};