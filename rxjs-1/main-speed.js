const { getRace } = require('./race');
const { getCarSpeed } = require('./getCarSpeed');


const race = getRace();


const speed$ = getCarSpeed(race, 'Lightning McQueen');

speed$.subscribe(speed => process.stdout.write(`Speed: ${speed}m/s\r`));

race.start();
