# Cueda

Gentle cues for time awareness and attention. Cueda is a personal Android-first app built with Expo and React Native.

## Development

Install dependencies once:

    npm install

With an Android development build installed on a connected device:

    npm run start:clear-dev

To build and install the Android development app:

    npm run android

Run checks before committing:

    npm run lint
    npx tsc --noEmit

## App identity

All user-facing and Android identity values live in [app.identity.json](./app.identity.json). Update that file to change the launcher name, Expo slug, URL scheme, Android package ID, and store copy.

Native Android files are generated and intentionally excluded from Git. preandroid syncs only the Android launcher label; Expo generates the URL schemes from the app configuration.

## Structure

- app/ — Expo Router screens
- components/ — reusable interface components
- theme/ — colour and appearance system
- utils/ — scheduling, validation, notification, and time helpers
- STORE_LISTING.md — Play Store title and short-description copy
