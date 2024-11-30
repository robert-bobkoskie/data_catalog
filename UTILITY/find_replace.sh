#!/bin/bash

# Define the search and replacement strings in arrays
search_patterns=(
  "style={ backgroundColor: '#f0f0f0' }"
  "style={ backgroundColor: 'blue' }"
  "style={ backgroundColor: 'green' }"
  "style={ backgroundColor: 'red' }"
  "style={ top: `${hintPosition.top}px`, left: `${hintPosition.left}px`, right: 'auto' }"
)

replacement_patterns=(
  "style={{ backgroundColor: '#e0e0e0' }}"
  "style={{ backgroundColor: 'blue' }}"
  "style={{ backgroundColor: 'green' }}"
  "style={{ backgroundColor: 'red' }}"
  "style={{ top: `${hintPosition.top}px`, left: `${hintPosition.left}px`, right: 'auto' }}"
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
