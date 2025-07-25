#!/bin/bash

INPUT_FILE="endpoints.txt"

echo "export const API_ENDPOINTS = {"

# Group by top-level path (e.g., plans, auth, subscriptions)
grep '^/api/' "$INPUT_FILE" | sort | while read -r path; do
  # Strip /api/ prefix
  rest="${path#/api/}"

  # Split the path
  IFS='/' read -ra parts <<< "$rest"

  group="$(echo "${parts[0]^}")" # Capitalize

  if [[ "$current_group" != "$group" ]]; then
    [[ -n "$current_group" ]] && echo "  },"
    echo "  $group: {"
    current_group="$group"
  fi

  if [[ "${#parts[@]}" -eq 1 ]]; then
    echo "    Root: \"$path\","
  elif [[ "${parts[1]}" == "[id]" ]]; then
    if [[ "${#parts[@]}" -eq 2 ]]; then
      echo "    ById: (id: string) => \`$path\`.replace('[id]', id),"
    else
      key="${parts[2]^}" # capitalize
      echo "    $key: (id: string) => \`$path\`.replace('[id]', id),"
    fi
  else
    key="${parts[1]}"
    for ((i=2; i<${#parts[@]}; i++)); do
      key="$key/${parts[i]}"
    done
    key_camel=$(echo "$key" | sed -E 's/\/([a-z])/\U\1/g' | sed 's/[^a-zA-Z0-9]//g')
    echo "    ${key_camel^}: \"$path\","
  fi
done

echo "  }"
echo "} as const;"


# chmod +x generate_api_endpoints.sh ./generate_api_endpoints.sh > api-endpoints.ts
