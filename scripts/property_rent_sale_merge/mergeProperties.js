const fs = require('fs');
const path = require('path');

const dataDir = __dirname;

// Read in the JSON files
const properties = JSON.parse(fs.readFileSync(path.join(dataDir, 'properties.json')));
const rents = JSON.parse(fs.readFileSync(path.join(dataDir, 'rent.json')));
const sales = JSON.parse(fs.readFileSync(path.join(dataDir, 'sale.json')));

// Match using formattedAddress
const rentMap = new Map(rents.map(r => [r.formattedAddress, r]));
const saleMap = new Map(sales.map(s => [s.formattedAddress, s]));

const allFormattedAddresses = [
  ...properties.map(p => p.formattedAddress),
  ...rents.map(r => r.formattedAddress),
  ...sales.map(s => s.formattedAddress),
];

const uniqueAddresses = Array.from(new Set(allFormattedAddresses));

const merged = uniqueAddresses.map(addr => {
  const prop = properties.find(p => p.formattedAddress === addr);
  const rent = rentMap.get(addr);
  const sale = saleMap.get(addr);

  return {
    id: prop?.id || sale?.id || rent?.id || addr,
    formattedAddress: addr,
    ...prop,
    rentInfo: rent || null,
    saleInfo: sale || null,
  };
});

fs.writeFileSync(path.join(dataDir, 'mergedProperties.json'), JSON.stringify(merged, null, 2));
console.log('✅ Merged data saved to mergedProperties.json');
