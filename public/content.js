// Content script to relay messages between background script and web page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Forward the message to the web page
  window.postMessage({
    type: 'FROM_EXTENSION',
    data: message
  }, '*');
});

// Listen for messages from the web page (if needed for bidirectional communication)
window.addEventListener('message', (event) => {
  // Only accept messages from the same window
  if (event.source !== window) return;
  
  if (event.data.type && event.data.type === 'TO_EXTENSION') {
    // Forward to background script if needed
    chrome.runtime.sendMessage(event.data.data);
  }
});
