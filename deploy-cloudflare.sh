#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploying Frontend to Cloudflare R2   ${NC}"
echo -e "${GREEN}========================================${NC}"

# Configuration
R2_ACCOUNT_ID="499d3122909e587791a61d54c6df6b24"
R2_BUCKET_NAME="willubmine"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}Installing Wrangler CLI...${NC}"
    npm install -g wrangler
fi

# Build the frontend
echo -e "\n${YELLOW}Building frontend...${NC}"
npm install
npm run build

# Upload to R2
echo -e "\n${YELLOW}Uploading to Cloudflare R2...${NC}"
wrangler r2 object put "${R2_BUCKET_NAME}/index.html" --file dist/index.html --content-type "text/html"

# Upload assets
for file in dist/assets/*; do
    filename=$(basename "$file")
    if [[ $filename == *.js ]]; then
        content_type="application/javascript"
    elif [[ $filename == *.css ]]; then
        content_type="text/css"
    else
        content_type="application/octet-stream"
    fi
    echo "Uploading $filename..."
    wrangler r2 object put "${R2_BUCKET_NAME}/assets/${filename}" --file "$file" --content-type "$content_type"
done

# Upload other files
for file in dist/*.js dist/*.webmanifest dist/*.png; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "Uploading $filename..."
        wrangler r2 object put "${R2_BUCKET_NAME}/${filename}" --file "$file"
    fi
done

echo -e "\n${GREEN}Frontend deployed to Cloudflare R2!${NC}"
echo -e "URL: https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
