# YT Shorts Blocker

YT Shorts Blocker is a Chrome extension that helps you control your YouTube experience by managing Shorts content and recommendations.

## Features

- **Block Shorts Scrolling**: Prevents endless scrolling through YouTube Shorts
- **Hide Recommended Content**: Removes all recommended videos from your YouTube homepage
- **Remove Shorts Completely**: Removes all Shorts-related content, including:
  - Shorts button in sidebar
  - Shorts sections on homepage
  - Shorts in search results
- **Hide Comments on Shorts**: Removes the comments button and panel from Shorts videos
- **Down Arrow Key Blocking**: Prevents using the down arrow key to scroll through Shorts

## Installation

1. Clone this repository or download the source code
2. Open Google Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files

## Usage

1. Click the extension icon in your browser toolbar to open the settings panel
2. Toggle the features you want to enable/disable:
   - Block Shorts Scrolling (enabled by default)
   - Hide Recommended Content
   - Remove Shorts Completely
   - Hide Shorts Comments

Settings are saved automatically and apply immediately to all open YouTube tabs.

## How It Works

The extension uses:
- Content scripts to modify YouTube's behavior and appearance
- Chrome Storage API to persist user settings
- MutationObserver to handle YouTube's dynamic content loading
- Custom CSS to hide unwanted elements
- Event listeners to block scrolling and keyboard navigation

## Files

- `manifest.json`: Extension configuration
- `content.js`: Content script that modifies YouTube pages
- `background.js`: Background script for tab communication
- `popup.html`: Settings UI
- `popup.css`: Styles for the settings UI
- `popup.js`: Settings logic and storage management

## Contributing

Found a bug or want to suggest a feature? Please open an issue or submit a pull request on our [GitHub repository](https://github.com/mazeincoding/YT-shorts-blocker).

## License

MIT License

## Disclaimer

This extension is not affiliated with, endorsed by, or sponsored by YouTube or Google. Use at your own discretion.