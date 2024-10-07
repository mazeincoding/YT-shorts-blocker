
# YT Shorts Blocker

YT Shorts Blocker is a Chrome extension that prevents users from endlessly scrolling through YouTube Shorts, helping to reduce distractions and improve productivity.

## Features

- Automatically detects when a user is viewing YouTube Shorts
- Blocks scrolling on YouTube Shorts pages
- Removes the "Next video" button

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## How It Works

The extension uses content scripts and background scripts to detect when a user is viewing YouTube Shorts. When on a Shorts page, it:

- Blocks scrolling on the main page
- Allows scrolling within the comments section
- Removes the "Next video" button
- Observes page changes to maintain functionality as the user navigates

## Files

- `manifest.json`: Extension configuration
- `content.js`: Content script that modifies the YouTube page
- `background.js`: Background script that communicates between tabs and the extension

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Disclaimer

This extension is not affiliated with, endorsed by, or sponsored by YouTube or Google. Use at your own discretion.