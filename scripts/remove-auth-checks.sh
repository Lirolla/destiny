#!/bin/bash
# Remove auth checks from all pages that have the standard pattern

PAGES_DIR="/home/ubuntu/destiny-hacking-app/client/src/pages"

# List of files to fix (they all have similar auth check patterns)
FILES=(
  "Dashboard.tsx"
  "DailyCycle.tsx"
  "Insights.tsx"
  "InnerCircle.tsx"
  "Settings.tsx"
  "Challenges.tsx"
  "Achievements.tsx"
)

for file in "${FILES[@]}"; do
  filepath="$PAGES_DIR/$file"
  if [ -f "$filepath" ]; then
    echo "Processing $file..."
    # Replace enabled: !!user with no condition
    sed -i 's/enabled: !!user,//g' "$filepath"
    sed -i 's/enabled: !!user//g' "$filepath"
    # Remove the authLoading check and sign-in fallback (will be handled per-file)
  fi
done

echo "Done removing auth checks from pages"
