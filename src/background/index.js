// Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
    // Create Context Menu
    chrome.contextMenus.create({
        id: 'add-to-notes',
        title: 'Add page to notes',
        contexts: ['page', 'selection']
    });
});

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'add-to-notes') {
        chrome.storage.local.get(['notes'], (result) => {
            const currentNotes = result.notes || '';
            const textToAdd = `\n- [${tab.title}](${tab.url})`;
            const newNotes = currentNotes + textToAdd;

            chrome.storage.local.set({ notes: newNotes });
        });
    }
});

// Handle Keyboard Commands
chrome.commands.onCommand.addListener((command) => {
    if (command === 'save-session') {
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
            const urls = tabs.map(tab => tab.url);
            const timestamp = new Date().toLocaleString();
            const sessionName = `Session ${timestamp}`;

            chrome.storage.local.get(['sessions'], (result) => {
                const sessions = result.sessions || {};
                sessions[sessionName] = urls;
                chrome.storage.local.set({ sessions });
            });
        });
    }
});

// Handle Website Blocker via Tab Updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only proceed if the URL has changed or the tab is newly loading with a URL
    if (changeInfo.status === 'loading' && tab.url) {
        chrome.storage.sync.get(['blockedSites'], (result) => {
            const blockedSites = result.blockedSites || [];
            if (blockedSites.length === 0) return;

            try {
                const urlObj = new URL(tab.url);
                const hostname = urlObj.hostname.toLowerCase();

                // Check if current hostname is in blocklist
                const isBlocked = blockedSites.some(site => hostname.includes(site.toLowerCase()));

                if (isBlocked) {
                    // Inject the script
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ['content.js']
                    }).catch(err => {
                        // Ignore the "Frame with ID 0 was removed" error
                        // It just means the page navigated away or closed before injection finished.
                        if (!err.message.includes('Frame with ID 0 was removed')) {
                            console.error('Failed to inject script:', err);
                        }
                    });
                }
            } catch (e) {
                // Invalid URL, do nothing
            }
        });
    }
});
