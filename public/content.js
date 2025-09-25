// Content script - runs in the context of web pages
console.log('Extension content script loaded');

// Listen for messages from the web app
window.addEventListener('message', (event) => {
  // Only accept messages from the same origin
  if (event.origin !== window.location.origin) return;
  
  if (event.data.type === 'REQUEST_EXTENSION_DATA') {
    console.log('Web app requesting extension data');
    
    // Send message to extension popup/background
    chrome.runtime.sendMessage({
      type: 'GET_EXTENSION_DATA',
      requestId: event.data.requestId
    }, (response) => {
      // Send response back to web app
      window.postMessage({
        type: 'EXTENSION_DATA_RESPONSE',
        requestId: event.data.requestId,
        data: response
      }, window.location.origin);
    });
  }
});

// Optional: Notify web app that extension is available
window.postMessage({
  type: 'EXTENSION_LOADED'
}, window.location.origin);