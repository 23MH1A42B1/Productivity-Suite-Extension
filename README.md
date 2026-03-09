# Productivity Suite Chrome Extension

A robust, multi-feature Chrome extension demonstrating Manifest V3 capabilities. Built with modern tools (React, Vite, Tailwind CSS v4) to ensure high-performance execution and premium UI/UX aesthetics.

---

## 🚀 Features & Capabilities

1. **Custom New Tab Dashboard (`newtab.html`)**
   - Completely overrides the default Chrome new tab.
   - Features a dynamic, modern layout.
   - Includes real-time integration fetching an inspirational "Quote of the Day" via open APIs.
   - Displays all your saved tab sessions and current markdown notes natively.

2. **Tab Session Management**
   - Save all tabs currently open in your browser window as a grouped bundle.
   - Restore sessions with a single click—opening all the saved URLs into a brand new window.
   - Easily remove old sessions you no longer need via the Popup or the New Tab Dashboard.

3. **Dynamic Website Blocker**
   - Prevent yourself from visiting distracting domains (e.g., `facebook.com`).
   - Uses Chrome's Background Service Workers to monitor navigation.
   - Automatically intercepts and overrides blocked websites securely with a local "Page Blocked" message before they can even load using Chrome Scripting APIs.

4. **Persistent Notes System**
   - Simple note-taking layout accessible from the Popup menu.
   - Markdown-friendly and securely saved locally on your device via `chrome.storage.local`.
   - Your notes automatically sync to your New Tab Dashboard widgets!

5. **Advanced Integrations**
   - **Context Menu:** Right-click anywhere on any webpage to instantly append that page's URL and title into your Notes.
   - **Keyboard Shortcuts:** Built-in Manifest V3 commands. Use `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to instantly launch the popup menu.

6. **Data Export (`options.html`)**
   - Download a comprehensive backup of all your sessions, notes, and blacklisted domains in a single JSON file (`productivity_suite_export.json`).

---

## 🛠️ Tech Stack
- Frontend: **React 19**
- Styling: **Tailwind CSS v4**
- Bundler: **Vite**
- APIs: **Chrome Manifest V3** (`chrome.storage`, `chrome.scripting`, `chrome.contextMenus`, etc.)

---

## 📦 Setup & Building the Extension

### Prerequisites
Make sure you have Node.js and npm installed on your machine.
- Node.js version 18+ is recommended.

### Building from Source
1. **Clone or Download the Repository** and navigate to its root folder.
   ```bash
   cd path/to/extension
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Compile the Code**
   ```bash
   npm run build
   ```
   *This command will bundle the React code, process the Tailwind CSS, handle the background workers, and deposit the final ready-to-use extension files inside a newly created `dist/` directory.*

---

## 🔧 How to install the Extension in Google Chrome

1. Open **Google Chrome**.
2. Type `chrome://extensions/` into your URL address bar and hit enter.
3. In the top-right corner, toggle the **Developer mode** switch to **ON**.
4. In the top-left corner, click the **Load unpacked** button.
5. In the file explorer, navigate to the project directory and **select the `dist/` folder** (which was generated when you ran `npm run build`). Click **Select Folder**.
6. **Done!** The "Productivity Suite" extension is now installed and active. 

*Tip: Click the puzzle piece icon in the top right of Chrome and pin the extension to your hotbar for easy access.*

---

## 📖 How to Use the Extension

### 1. Saving a Session & Notes
- Click the Extension icon in your browser toolbar to open the Popup.
- Type notes in the text area and hit **Save Notes**.
- Type a name into the Session box and click **Save** to back up all currently open tabs. 

### 2. Blocking a Website
- Right-click the extension icon and select **Options**.
- Type a hostname (e.g., `youtube.com`) into the input field and hit **Add**.
- If you try opening a new tab and navigating to `youtube.com`, the extension's background worker will catch it and block the page.

### 3. Viewing the Dashboard
- Simply press `Ctrl + T` (or `Cmd + T` on Mac) to open a new tab. 
- You will be greeted by the Custom Dashboard showing your notes, sessions, and a daily quote.

### 4. Right-Click Quick Save
- Browse to any interesting site. Right-click anywhere on the webpage.
- Click **"Add page to notes"**. Open the popup, and you'll see the link successfully copied over!
