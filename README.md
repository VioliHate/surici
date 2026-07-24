# Surici

**Surici** is a React Native recipe finder inspired by the clever Calabrian pantry mouse that always finds something to eat. Enter the ingredients you already have, and Surici will discover delicious recipes using the **TheMealDB API**.

## Tech Stack

- Expo
- React Native
- TypeScript
- React Navigation v6+
- Zustand
- AsyncStorage
- NativeWind
- React Native Paper
- Expo Image
- TheMealDB API

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd surici
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npx expo start
```

Then choose one of the available targets:

- Android Emulator
- iOS Simulator
- Expo Go
- Web Browser

## Available Scripts

```bash
npm install        # Install dependencies
npm start          # Start Expo
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on Web
npm run lint       # Run ESLint
```

## Project Structure

```
app/          # Screens
components/   # Reusable UI components
hooks/        # Custom hooks
services/     # API calls
store/        # Zustand stores
types/        # TypeScript types
utils/        # Utility functions
assets/       # Images, fonts and static resources
```

## Features

- Search recipes by available ingredients
- View detailed recipe information
- Save preferences locally
- Responsive and modern UI
- Fast and lightweight experience

## License

This project is licensed under the MIT License.
