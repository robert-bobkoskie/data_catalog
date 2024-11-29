#!/bin/bash

# Define the search and replacement strings in arrays
search_patterns=(
  "style={{ backgroundColor: '#f0f0f0' }}"
  "style={{ backgroundColor: 'blue' }}"
  "style={{ backgroundColor: 'green' }}"
  "style={{ backgroundColor: 'red' }}"
)

replacement_patterns=(
  "style={{ backgroundColor: '#e0e0e0' }}"
  "style={{ backgroundColor: '#0000ff' }}"
  "style={{ backgroundColor: '#008000' }}"
  "style={{ backgroundColor: '#ff0000' }}"
)

# Prompt the user for the filename
read -p "Enter the filename: " file

# Loop through the search and replacement strings
for i in "${!search_patterns[@]}"; do
  search="${search_patterns[$i]}"
  replace="${replacement_patterns[$i]}"
  sed -i "s/${search}/${replace}/g" "$file"
done

echo "Replacements complete!"
