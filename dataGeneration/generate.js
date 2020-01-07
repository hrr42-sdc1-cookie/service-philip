const cliProgress = require('cli-progress');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const faker = require('faker');
const path = require('path');

const [,, significand, magnitude, rawSuffix] = process.argv
  .map(val => (Number.isNaN(Number(val)) ? val : Number(val)));
if (Number.isNaN(Number(significand)) || Number.isNaN(Number(magnitude))) {
  const scriptname = path.basename(__filename);
  console.log(
    `usage: node ${scriptname} SIGNIFICAND MAGNITUDE [FILENAME_SUFFIX]\n`
    + `Example: node ${scriptname} 1.42 6 1.42M\n`
    + '(Generates 1.42x10^6 (1,420,000) primary records in restaurants1.42M.csv)',
  );
  process.exit();
}

const suffix = rawSuffix || '';

const restaurantCsvWriter = createCsvWriter({
  path: path.resolve(__dirname, `restaurants${suffix}.csv`),
  header: [
    { id: 'id', title: 'id' },
    { id: 'name', title: 'name' },
    { id: 'seats', title: 'seats' },
    { id: 'tables', title: 'tables' },
    { id: 'latitude', title: 'latitude' },
    { id: 'longitude', title: 'longitude' },
  ],
});

const reservationCsvWriter = createCsvWriter({
  path: path.resolve(__dirname, `reservations${suffix}.csv`),
  header: [
    { id: 'restaurantId', title: 'restaurantId' },
    { id: 'customerName', title: 'customerName' },
    { id: 'reservationTime', title: 'reservationTime' },
    { id: 'guestCount', title: 'guestCount' },
  ],
});

const generateData = (restaurantCount, minReservations, maxReservations) => {
  const seatLimits = { min: 10, max: 250 };
  const guestLimits = { min: 2, max: 8 };
  const reservationLimits = { min: minReservations, max: maxReservations };

  const progressBar = new cliProgress.SingleBar({
    hideCursor: true,
    fps: 1,
    format: '{bar} {percentage}% | Elapsed: {duration_formatted}',
  }, cliProgress.Presets.shades_classic);

  progressBar.start(restaurantCount);

  let seats;
  let i = 0;
  const csvBatchSize = 10 ** 4;

  const writeBatch = () => {
    const remainingRecords = restaurantCount - i;
    if (remainingRecords) {
      const batchLimit = Math.min(csvBatchSize, remainingRecords);
      const restaurants = [];
      const reservations = [];
      let reservationCount;
      for (let j = 0; j < batchLimit; j++) {
        seats = faker.random.number(seatLimits);
        reservationCount = faker.random.number(reservationLimits);
        restaurants.push({
          id: i,
          name: `The ${faker.company.companyName()} Food ${faker.company.companySuffix()}`,
          seats,
          tables: faker.random.number({ min: seats / 4, max: seats / 3 }),
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude(),
        });
        for (let k = 0; k < reservationCount; k++) {
          reservations.push({
            restaurantId: i,
            customerName: faker.name.firstName(),
            reservationTime: faker.date.future(5).toISOString(),
            guestCount: faker.random.number(guestLimits),
          });
        }
        progressBar.update(++i);
      }
      restaurantCsvWriter.writeRecords(restaurants)
        .then(() => reservationCsvWriter.writeRecords(reservations))
        .then(() => writeBatch());
    } else {
      progressBar.stop();
    }
  };
  writeBatch();
};

generateData(significand * 10 ** magnitude, 1, 30);
