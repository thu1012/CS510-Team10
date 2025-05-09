import json
import time
from gemini_client import call_gemini  # Import the function from your existing file

# Load the addresses from extracted_addresses.json
with open("extracted_addresses.json", "r") as infile:
    addresses = json.load(infile)

output_file = "descriptions.json"

# Open the output file in write mode and start the JSON array
with open(output_file, "w") as outfile:
    outfile.write("[\n")

    for idx, item in enumerate(addresses):
        address = item["formattedAddress"]
        prompt = f"Write a professional real estate property description for this address: {address}"
        print(f"Generating description for: {address}")

        description = call_gemini(prompt)
        time.sleep(0.5)
        description_text = description.strip() if description else ""

        # Write the current object
        json.dump({"address": address, "description": description_text}, outfile, indent=2)
        
        # Add a comma if it's not the last item
        if idx < len(addresses) - 1:
            outfile.write(",\n")
        else:
            outfile.write("\n")

    # Close the JSON array
    outfile.write("]\n")

print(f"Descriptions saved incrementally to {output_file}")
