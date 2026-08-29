# Cueda

Gentle cues for time awareness and attention. Cueda is a personal, local-first app built with Expo and React Native. It is Android-first, with iOS-compatible configuration.

## Attention Interrupter

Attention Interrupter is a single, intentional session rather than a recurring schedule. Choose any whole-minute interval of five minutes or more, a bundled sound, and either a duration or "Until I stop".

- Only one session can be active at a time.
- Timed sessions schedule at most 60 pending cues, a limit shared across Android and iOS.
- Open-ended sessions use one repeating local notification until stopped.
- Pausing holds the remaining active time; resuming starts a fresh interval cadence.
- Missed cues are never replayed.

Preferences and the active session are stored privately on-device. Cueda does not require an account.

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

Native notification changes, including the bundled cue sounds, require rebuilding the development app with `npm run android`.

## Structure

- app/ — Expo Router screens
- features/ — feature-specific interface, domain rules, and services
- components/ui/ — reusable interface primitives
- lib/ — shared storage, notification, identity, and time helpers
- theme/ — persisted appearance preference and semantic colour tokens
- STORE_LISTING.md — Play Store title and short-description copy
