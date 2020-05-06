const { zip } = require('rxjs');
const { map, withLatestFrom } = require('rxjs/operators');

const { getCarSpeed } = require('./getCarSpeed');
const { getCarStates } = require('./getCarsStates');


const sortByxLocation = (a, b) => (b.xLocation - a.xLocation);


const getLeaderBoard = (race) => {
  const cars = race.getCars();

  const carsStates = cars.map(carName => (
    getCarStates(race, carName).pipe(
      withLatestFrom(getCarSpeed(race, carName)),
      map(([state, speed]) => ({ ...state, speed }))
    )
  ));

  return zip(...carsStates).pipe(
    map(state => {
      const leaderBoard = state.sort(sortByxLocation);
      const leaderState = leaderBoard[0];
      return leaderBoard.map(({ carName, xLocation, speed }, i) => {
        const position = i + 1;
        const leaderGapDistance = Math.round(leaderState.xLocation - xLocation);
        const leaderGapTime = speed !== 0 ? Math.round((leaderState.xLocation - xLocation) / speed * 1000) : '-';
        return ({
          position,
          carName,
          leaderGapDistance,
          leaderGapTime
        });
      });
    })
  );
}


module.exports = {
  getLeaderBoard
};
