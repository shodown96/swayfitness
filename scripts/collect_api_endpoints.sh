#!/bin/bash

# Define base API directory
API_DIR="app/api"

# Check if directory exists
if [ ! -d "$API_DIR" ]; then
  echo "No 'app/api' directory found. Exiting."
  exit 1
fi

echo "Collecting API endpoints from $API_DIR..."
echo ""

# Find all route.ts or route.js files
find "$API_DIR" -type f \( -name "route.ts" -o -name "route.js" \) | while read -r filepath; do
  # Remove API_DIR prefix and strip /route.ts or /route.js suffix
  relative_path="${filepath#$API_DIR}"
  route_path="${relative_path%/route.ts}"
  route_path="${route_path%/route.js}"

  # Replace leading slash if missing
  [[ "$route_path" != /* ]] && route_path="/$route_path"

  # Output final endpoint path
  echo "/api$route_path"
done
