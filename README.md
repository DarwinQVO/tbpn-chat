# tbpn-chat

This project contains a set of Firebase Cloud Functions along with a minimal web page for testing them.

## Project purpose

The code in the `functions` directory exposes HTTP endpoints that respond to simple chat requests and create placeholder jobs in Firestore. A Firestore trigger is also defined as a stubbed worker. The `public/index.html` file provides a very small UI to send a query to the `/chat` function from a browser.

## Installing dependencies

```bash
cd functions
npm install
```

## Deploying or emulating

Install the Firebase CLI if you do not already have it:

```bash
npm install -g firebase-tools
```

Log in and initialise a Firebase project (`firebase init`) if required. To deploy only the Cloud Functions run:

```bash
firebase deploy --only functions
```

To run the functions locally instead of deploying, start the emulators:

```bash
firebase emulators:start
```

## Chat UI

The `public/index.html` file is a small web page with a text box and button that sends your input to the `/chat` endpoint and shows the response.
