#!/bin/bash

# This script lists all non-API page routes in a Next.js App Router project

echo "Non-API page routes:"
echo

find app -type f -name "page.tsx" | grep -v "/api/" | while read -r file; do
  # Remove 'app' prefix and '/page.tsx' suffix
  path="${file#app}"
  path="${path%/page.tsx}"

  # Remove route groups like (main) or (auth)
  path=$(echo "$path" | sed -E 's/\([^)]+\)//g' | sed -E 's/\/+/\//g')

  # Default to "/" if path is empty
  path="/${path#/}"
  [[ "$path" == "/" ]] && echo "/" || echo "$path"
done
