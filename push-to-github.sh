bash

# ---- CONFIG ----
GITHUB_USER="NarcisussX"
REPO_NAME="triffnix-chatgpt"
ZIP_FILE="triffnix-chatgpt.zip"
# ----------------

# Unzip the project
unzip "$ZIP_FILE" -d .

# Move into the unzipped directory
cd "$REPO_NAME"

# Initialize Git and commit
git init
git add .
git commit -m "Initial commit"

# Add remote using HTTPS
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
git branch -M main

# Push to GitHub (will prompt for username + token/password)
git push -u origin main