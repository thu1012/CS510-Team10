import json

# Read input JSON from mergedProperties.json
with open("mergedProperties.json", "r") as infile:
    data = json.load(infile)

# Extract formattedAddress fields
extracted_addresses = [{"formattedAddress": item["formattedAddress"]} for item in data]

# Write extracted addresses to a new JSON file
with open("extracted_addresses.json", "w") as outfile:
    json.dump(extracted_addresses, outfile, indent=2)

print("Addresses extracted and saved to 'extracted_addresses.json'")
