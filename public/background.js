// Background script to handle web app requests
let pendingRequests = [];

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log('Received message from web app:', message);
  
  if (message.type === 'PING') {
    sendResponse({ status: 'ok' });
    return;
  }
  
  if (message.type === 'REQUEST_ACCESS') {
    // Store the request with tab ID
    const request = {
      id: Date.now(),
      origin: sender.origin,
      timestamp: message.timestamp,
      tabId: sender.tab?.id,
      sender: sender
    };
    
    pendingRequests.push(request);
    
    // Set badge to show pending request
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#ff4444' });
    
    // Open the extension popup if requested
    if (message.openPopup) {
      chrome.action.openPopup().then(() => {
        sendResponse({ popupOpened: true });
      }).catch((error) => {
        console.log('Could not open popup:', error);
        sendResponse({ popupOpened: false });
      });
    } else {
      sendResponse({ popupOpened: false });
    }
    
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
  
  if (message.type === 'CREATE_DATA') {
    // Handle data from web app
    console.log('Received data from web app:', message.data);
    
    // Broadcast to popup if it's open
    chrome.runtime.sendMessage({
      type: 'DATA_RECEIVED',
      data: message.data
    }).catch(() => {
      // Popup might not be open, that's okay
      console.log('Popup not open, data logged in background');
    });

    if (message.openPopup) {
      chrome.action.openPopup().then(() => {
        sendResponse({ popupOpened: true });
      }).catch((error) => {
        console.log('Could not open popup:', error);
        sendResponse({ popupOpened: false });
      });
    } else {
      sendResponse({ popupOpened: false });
    }
    
    // Send back a success response to the web app
    sendResponse({
      success: true,
      message: 'Data received successfully',
      receivedData: message.data
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
    if (request && request.tabId) {
      // Send message directly to the web app tab
      chrome.tabs.sendMessage(request.tabId, {
        type: 'ACCESS_RESPONSE',
        granted: message.granted,
        nillionDiD: message.nillionDiD,
        nillionDiDObj: message.nillionDiDObj
      }).catch(error => {
        console.log('Error sending response to tab:', error);
      });
      
      // Remove from pending
      pendingRequests = pendingRequests.filter(r => r.id !== message.requestId);
      
      // Update badge
      if (pendingRequests.length === 0) {
        chrome.action.setBadgeText({ text: '' });
      } else {
        chrome.action.setBadgeText({ text: pendingRequests.length.toString() });
      }
    }
    
    sendResponse({ success: true });
  }
});