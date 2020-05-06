const Table = require('easy-table')

const { getLeaderBoard } = require('./getLeaderBoard');

const { getRace } = require('./race');
const race = getRace();


const leaderBoard$ = getLeaderBoard(race);

leaderBoard$.subscribe(leaderBoard => {
  const t = new Table();
  leaderBoard.forEach(function(car) {
    t.cell('#', car.position);
    t.cell('Name', car.carName);
    t.cell('Gap Distance', `${car.leaderGapDistance}m`);
    t.cell('Gap Time', `${car.leaderGapTime}ms`);
    t.newRow();
  });
  process.stdout.write(t.toString());
  // clear current the table at next writing
  process.stdout.moveCursor(0, -4);
});

race.start();