const fs = require('fs');

// Load the property data and descriptions from JSON files
const propertyFile = './mergedProperties.json'; // Path to your property data JSON file
const descriptionFile = './descriptions_1.json'; // Path to your description data JSON file

// Read the property data and description data from files
const loadData = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

// Merge descriptions into the property data based on address
const mergeDescriptions = (propertyData, descriptionData) => {
  // Create a lookup map from address to description
  const descriptionMap = descriptionData.reduce((acc, item) => {
    acc[item.address] = item.description;
    return acc;
  }, {});

  // Merge descriptions into the property data
  return propertyData.map(property => {
    if (descriptionMap[property.address]) {
      property.description = descriptionMap[property.address];
    } else {
      property.description = "No description available"; // Default message if no description is found
    }
    return property;
  });
};

// Save the updated property data back to a file
const saveData = (data, filePath) => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
    if (err) console.error('Error saving file:', err);
    else console.log('Data successfully saved!');
  });
};

const run = async () => {
  try {
    // Load both property and description data
    const propertyData = await loadData(propertyFile);
    const descriptionData = await loadData(descriptionFile);

    // Merge descriptions into property data
    const updatedPropertyData = mergeDescriptions(propertyData, descriptionData);

    // Save the updated data
    saveData(updatedPropertyData, './updated_property_data.json'); // Specify the path for the output
  } catch (err) {
    console.error('Error:', err);
  }
};

run();
