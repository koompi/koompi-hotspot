# install new dependencies if any
npm install

# # Re-Compile bcrypt module
# npm rebuild bcrypt --build-from-source


# uninstall the current bcrypt modules
npm uninstall bcrypt

# install the bcrypt modules for the machine
npm install bcrypt

echo "Starting API server"

npm run server