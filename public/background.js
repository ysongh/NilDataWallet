// Background script to handle web app requests
let pendingRequests = [];

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log('Received message from web app:', message);
  
  if (message.type === 'PING') {
    sendResponse({ status: 'ok' });
    return;
  }
  
  if (message.type === 'REQUEST_ACCESS') {
    // Store the request
    const request = {
      id: Date.now(),
      origin: sender.origin,
      timestamp: message.timestamp,
      sender: sender,
      sendResponse: sendResponse
    };
    
    pendingRequests.push(request);
    
    // Set badge to show pending request
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#ff4444' });
    
    // Open the extension popup if requested
    if (message.openPopup) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          // Note: This opens the popup programmatically
          chrome.action.openPopup().then(() => {
            sendResponse({ popupOpened: true });
          }).catch((error) => {
            console.log('Could not open popup:', error);
            sendResponse({ popupOpened: false });
          });
        }
      });
    }
    
    // Keep the message channel open
    return true;
  }
  
  if (message.type === 'GET_TAB_INFO') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({
          title: tabs[0].title,
          url: tabs[0].url
        });
      }
    });
    return true;
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PENDING_REQUESTS') {
    sendResponse({ requests: pendingRequests });
  }
  
  if (message.type === 'RESPOND_TO_REQUEST') {
    const request = pendingRequests.find(r => r.id === message.requestId);
    if (request) {
      // Send response back to web app
      request.sendResponse({ granted: message.granted });
      
      // Remove from pending
      pendingRequests = pendingRequests.filter(r => r.id !== message.requestId);
      
      // Update badge
      if (pendingRequests.length === 0) {
        chrome.action.setBadgeText({ text: '' });
      } else {
        chrome.action.setBadgeText({ text: pendingRequests.length.toString() });
      }
    }
  }
});
