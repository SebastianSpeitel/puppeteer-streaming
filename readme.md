# Setup

## Installing

Run `npm i` in `./`, `./render` and `./runner`.

## Config

Set your twitch stream key in [settings.json](./settings.json)

## Building

Run `npm run build` in `./render` and `./runner`.

## Starting

1. Start the renderer (`npm start` in `./renderer`)
2. Start the runner (`npm start` in `./runner`)

# TODOs

- [x] Run puppeteer
- [x] capture tab
- [x] send video from chrome to node
- [x] send video from node to twitch
- [ ] embed video in chrome
- [ ] receive incoming stream
- [ ] stream from node to chrome
- [ ] build vue components
  - [ ] incoming video (`<video>`)
    - greenscreen keying?
  - [ ] embedding "legacy" overlays (`<iframe>`)
- [ ] build module for frontend (no need for page.evaluate)
- [ ] GUI to control the state of the renderer?
