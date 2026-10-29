# Live Camera Share — starter demo

This is a consent-based, browser-based WebRTC starter project. The phone owner must choose
“Camera sharer”, grant camera permission, and press “Start sharing”. A visible local preview
is shown. The viewer needs the private room code.

## Run locally (computer)

1. Install Node.js 18+ from https://nodejs.org/
2. Extract this ZIP.
3. Open a terminal in the extracted folder.
4. Run:
   ```bash
   npm install
   npm start
   ```
5. Open `http://localhost:3000` on the computer to test the viewer.
   For camera testing on another phone, deploy with HTTPS; camera access on a remote
   device generally requires a secure context.

## Deploy for internet use

Deploy this folder as a Node web service on a hosting provider that supports Node.js and
WebSockets (for example, Render). Use the start command `npm start`. The host will provide
an HTTPS URL. Open that URL on both devices.

1. On the phone: select “Camera sharer”, enter a private room code (8–64 characters),
   press Connect, then Start sharing and approve the camera permission prompt.
2. On the computer: open the same HTTPS URL, select “Viewer”, enter the exact same room
   code, and press Connect.
3. To stop: the phone owner presses “Stop / disconnect”.

## Important limitations before real use

- This is a starter/demo, not a production-hardened service.
- STUN-only WebRTC may fail on some mobile networks or restrictive NATs. For reliable
  cross-network streaming, configure a TURN provider and add its ICE server URL and
  credentials in `public/index.html`. Keep TURN credentials private.
- Add authentication, short-lived room codes, rate limiting, HTTPS-only hosting, stricter
  CORS/origin controls, and room expiration before sharing publicly.
- Do not expose or publish a person's camera without their informed, ongoing consent.
- No audio is captured by this demo.
