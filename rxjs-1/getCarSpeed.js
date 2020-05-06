const { zip, interval } = require('rxjs');
const { startWith, bufferToggle, map } = require('rxjs/operators');

const { getCarStates } = require('./getCarsStates');


const computeSpeed = (newest, oldest = { time: 0, xLocation: 0 }) => {
  if (!newest.time) return 0;
  const duration = (newest.time - oldest.time) / 1000;
  const distance = newest.xLocation - oldest.xLocation;
  return ((distance / duration).toFixed(2));
}


const getCarSpeed = (race, carName) => {
  const carState$ = getCarStates(race, carName);
  const getBufferFrame = () => interval(200);

  const buffer$ = carState$.pipe(
    bufferToggle(carState$, getBufferFrame),
    startWith([], [], [])
  );

  return zip(carState$, buffer$).pipe(
    map(([currentState, bufferedStates]) => computeSpeed(currentState, bufferedStates[0]))
  )
}


module.exports = {
  getCarSpeed
};
