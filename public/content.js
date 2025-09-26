// Content script - runs in the context of web pages
console.log('Extension content script loaded');

let isAuthorized = false;

// Check if this domain is already authorized
chrome.storage.sync.get([`authorized_${window.location.origin}`], (result) => {
  isAuthorized = result[`authorized_${window.location.origin}`] || false;
  
  // Notify web app of extension availability and auth status
  window.postMessage({
    type: 'EXTENSION_LOADED',
    isAuthorized: isAuthorized
  }, window.location.origin);
});

// Listen for messages from the web app
window.addEventListener('message', (event) => {
  // Only accept messages from the same origin
  if (event.origin !== window.location.origin) return;
  
  if (event.data.type === 'REQUEST_AUTHORIZATION') {
    console.log('Web app requesting authorization');
    
    // Send authorization request to extension
    chrome.runtime.sendMessage({
      type: 'AUTHORIZATION_REQUEST',
      origin: window.location.origin,
      domain: window.location.hostname,
      requestId: event.data.requestId
    });
  }
  
  if (event.data.type === 'REQUEST_EXTENSION_DATA') {
    if (!isAuthorized) {
      window.postMessage({
        type: 'EXTENSION_DATA_RESPONSE',
        requestId: event.data.requestId,
        error: 'Not authorized'
      }, window.location.origin);
      return;
    }
    
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

// Listen for authorization updates from extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AUTHORIZATION_GRANTED') {
    isAuthorized = true;
    window.postMessage({
      type: 'AUTHORIZATION_GRANTED'
    }, window.location.origin);
  }
  
  if (message.type === 'AUTHORIZATION_REVOKED') {
    isAuthorized = false;
    window.postMessage({
      type: 'AUTHORIZATION_REVOKED'
    }, window.location.origin);
  }
});
