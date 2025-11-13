# React Native Rent App

A React Native Expo application built with TypeScript for managing rental properties.

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for routing and navigation
- **Expo Linear Gradient** for UI gradients

## Project Structure

```
.
├── src/
│   ├── components/      # Reusable UI components
│   ├── constants/       # App constants (colors, fonts)
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # Application screens
│   └── types/           # TypeScript type definitions
├── assets/
│   └── images/          # Image assets
├── App.tsx              # Application entry point
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
```bash
npm run android  # For Android
npm run ios      # For iOS (macOS only)
npm run web      # For Web
```

## Development

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the screen type to `RootStackParamList` in `src/types/navigation.ts`
3. Register the screen in `src/navigation/RootNavigator.tsx`

### Constants

- **Colors**: Defined in `src/constants/colors.ts`
- **Fonts**: Defined in `src/constants/fonts.ts`

## Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

## License

MIT
