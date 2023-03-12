const express = require('express');
const fs = require('fs');

function logRequests(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

const app = express();

// Apply middleware to all routes
app.use(logRequests);

app.get('/', (req, res) => {
  const start = req.query.start || '2021-01-01T00:00:00.000Z';
  const end = req.query.end || '2023-02-12T00:00:00.000Z';
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  // Generate the response data
  const responseData = getMockData(start, end);
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(responseData));
    res.end();
  });
});

app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});


function getMockData(start, end) {
  const rangeFrom = Date.parse(start);
  const rangeTo = Date.parse(end);

  // Read mock data from JSON file
  const mockData = JSON.parse(fs.readFileSync('data/ticket.json'));
  const responseData = [];
  for (let i = 0; i < mockData.regions.length; i++) {
    const region = mockData.regions[i];
    for (let j = 0; j < region.countries.length; j++) {
      const country = region.countries[j];
      for (let k = 0; k < country.cities.length; k++) {
        const city = country.cities[k];
        let date = rangeFrom;
        while (date <= rangeTo) {
          const value = Math.random() * (city.maxValue - city.minValue) + city.minValue;
          // Add 1 day to the date
          responseData.push({
            region: region.name,
            country: country.name,
            city: city.name,
            time: date,
            value: Math.round(value)
          });
          date += 86400000;
        }
      }
    }
  }
  return responseData;
}
