import json
import csv
from collections import Counter

# 1) Point this at your schools.json
with open('schools.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 2) Extract the ZIP field you care about (e.g. 'zip_location')
zip_codes = [rec['zip_location'] for rec in data['results']]

# 3) Tally counts per ZIP
counts = Counter(zip_codes)

# 4) Write them out, sorted by ZIP
with open('school_counts_by_zip.csv', 'w', newline='', encoding='utf-8') as out:
    writer = csv.writer(out)
    writer.writerow(['Zipcode', 'SchoolCount'])
    for zipcode in sorted(counts):
        writer.writerow([zipcode, counts[zipcode]])

print("Written: school_counts_by_zip.csv")
