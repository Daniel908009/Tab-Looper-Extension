# Tab Looper Web Extension
Tab Looper is a Chromium browser extension that lets you create a custom list of tabs and automatically cycle through them using keyboard shortcuts.

## Features
- Add the current tab to a custom loop list
- Remove tabs individually or clear the entire list
- Automatically cycle through saved tabs using a keyboard shortcuts
- Visual popup UI showing all saved tabs with their favicons and titles
- Notifications when a tab is added or removed
- Works across browser restarts (state is saved in local storage)
- Highlights the active tab inside the popup (green outline)
- Works across multiple windows
- Reopens a new tab with the same URL if the original one was closed

## Installation
1. Clone or download this repository
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the folder containing the extension

This extension was developed and tested in Google Chrome so it should also work in all Chromium based browsers (most browsers except Firefox).

## Keyboard Shortcuts
You can view or change the extension keyboard shortcuts in `chrome://extensions/shortcuts` (or your browser’s equivalent page)

## Usage
1. Open websites you want to include in the loop
2. Add tabs using either the button inside the extension popup or keyboard shortcut
3. Use the assigned keyboard shortcut to start cycling through the saved tabs

You can manage the list at any time using the controls inside the popup or via shortcuts.
Note: On some websites/tabs the notification doesn't show up. This is because some tabs don't allow content.js (typically it's new tabs or browser tabs like `/extensions`).
