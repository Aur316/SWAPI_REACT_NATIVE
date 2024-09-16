# Star Wars Characters Search App

This React Native app allows users to search for Star Wars characters by name using the Star Wars API (SWAPI). It displays characters with blue eyes first (sorted alphabetically), followed by other characters, sorted by their creation date.

## Features

- **Search Functionality**: Search for Star Wars characters by name.
- **Sorting**: 
  - Characters with blue eyes are shown first, sorted alphabetically.
  - Other characters are listed next, sorted by creation date.
- **Pagination**: Choose how many characters to display per page (25, 50, 100, 150).
- **Testing**: Basic unit tests ensure search functionality works properly.

## Installation

1. **Clone the repository**:  
   Run the following command to clone the repository to your local machine:
   ```bash
   git clone <https://github.com/Aur316/SWAPI_REACT_NATIVE.git>
   ```
Navigate to the project folder:
 ```bash
   cd StarWarsCharacters
```
2. **Install the necessary dependencies**:
Run the following command to install all required packages:
 ```bash
   npm install
```
3. **Start the app**:
Run the following command to start the app with Expo:
 ```bash
  npx expo start
```
You can then open it in a web browser or use an emulator.

-------
Testing
To run the unit tests, execute the following command:
 ```bash
  npm test
```

This will run all the tests and ensure the search functionality works as expected.

Technologies
React Native: For building the app.
TypeScript: Ensures type safety.
Axios: For making API requests to SWAPI.
Jest and @testing-library/react-native: For unit testing.
