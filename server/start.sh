# install new dependencies if any
npm install

# Re-Compile bcrypt module
npm rebuild bcrypt --build-from-source

echo "Starting API server"

npm run server