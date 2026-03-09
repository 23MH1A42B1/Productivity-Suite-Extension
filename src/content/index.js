// Content Script to block page
const blockPage = () => {
    // Stop page load
    window.stop();

    // Replace HTML content
    document.documentElement.innerHTML = `
    <html>
      <head>
        <title>Page Blocked</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #111827;
            color: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .container {
            max-width: 600px;
            padding: 40px;
            background: #1f2937;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid #374151;
          }
          h1 {
            color: #ef4444;
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          p {
            color: #9ca3af;
            font-size: 1.125rem;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 data-testid="blocked-message">Page Blocked</h1>
          <p>This website is on your blocked list. Focus on your productivity!</p>
        </div>
      </body>
    </html>
  `;
};

// Check if document already exists to replace it, otherwise try to do it as quickly as possible.
if (document.documentElement) {
    blockPage();
} else {
    document.addEventListener('DOMContentLoaded', blockPage);
}
