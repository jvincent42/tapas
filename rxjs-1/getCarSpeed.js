const { zip, interval } = require('rxjs');
const { startWith, bufferToggle, map } = require('rxjs/operators');

const { getCarStates } = require('./getCarsStates');


/**
 * Compute the speed of a car using 2 positons in time and space
 * 
 * @param {object} newest
 * @param {number} newest.time - time elapsed since the begining of the race (in ms)
 * @param {number} newest.distance - distance from the starting line (in meters)
 * @param {object} oldest
 * @param {number} oldest.time - time elapsed since the begining of the race (in ms)
 * @param {number} oldest.distance - distance from the starting line (in meters)
 * @returns {number} - speed in m/s
 */
const computeSpeed = (newest, oldest = { time: 0, xLocation: 0 }) => {
  if (!newest.time) return 0;
  const duration = (newest.time - oldest.time) / 1000;
  const distance = newest.xLocation - oldest.xLocation;
  return ((distance / duration).toFixed(2));
}


/**
 * Creates an Observable emitting the speeds of a car
 * 
 * @param {NodeStyleEventEmitter} race
 * @param {string} carName
 * @returns {Observable} - Observable emitting speeds (in m/s)
 */
const getCarSpeed = (race, carName) => {
  const carState$ = getCarStates(race, carName);
  const getBufferFrame = () => interval(200);

  const buffer$ = carState$.pipe(
    bufferToggle(carState$, getBufferFrame),
    startWith([], [], [])
  );

  // Pair each car event with its corresponding buffer and compute the
  // speed using current car event and oldest element in associated buffer
  return zip(carState$, buffer$).pipe(
    map(([currentState, bufferedStates]) => computeSpeed(currentState, bufferedStates[0]))
  )
}


module.exports = {
  getCarSpeed
};
