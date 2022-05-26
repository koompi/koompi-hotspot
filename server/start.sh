apk install update
apk add python3
apk add build-base
npm install -g npm@8.5.0

# install new dependencies if any
npm install

# Re-Compile bcrypt module
npm rebuild bcrypt --build-from-source

echo "Starting API server"

node --max-old-space-size=4096 index.js