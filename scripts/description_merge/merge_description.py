import json

# Load mergedProperties.json
with open('mergedProperties.json', 'r') as f:
    merged_properties = json.load(f)

# Load description.json
with open('description.json', 'r') as f:
    descriptions = json.load(f)

# Create a lookup dictionary from descriptions
description_lookup = {desc['address']: desc['description'] for desc in descriptions}

# Merge description into merged properties
for prop in merged_properties:
    address = prop.get('formattedAddress')
    if address in description_lookup:
        prop['description'] = description_lookup[address]
    else:
        prop['description'] = None  # Optional: add None if no matching description

# Save merged output to a new file
with open('full_property.json', 'w') as f:
    json.dump(merged_properties, f, indent=2)

print("Merging completed. Output saved to 'full_property.json'.")
