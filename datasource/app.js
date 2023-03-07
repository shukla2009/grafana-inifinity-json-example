const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const requestData = {
      "range": {
        "from": "2021-01-01T00:00:00.000Z",
        "to": "2023-03-06T00:00:00.000Z"
      }
    };
    const rangeFrom = Date.parse(requestData.range.from);
    const rangeTo = Date.parse(requestData.range.to);

    // Read mock data from JSON file
    const mockData = JSON.parse(fs.readFileSync('data/ticket.json'));

    // Generate the response data
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
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(responseData));
    res.end();
  });
});

server.listen(3001, () => {
  console.log('HTTP server listening on port 3001');
});