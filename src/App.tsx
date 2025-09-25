import { useState, useEffect } from 'react'

interface TabInfo {
  title?: string;
  url?: string;
}

function App() {
  const [currentTab, setCurrentTab] = useState<TabInfo>({})
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Get current tab information
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          setCurrentTab({
            title: tabs[0].title,
            url: tabs[0].url
          })
        }
      })
    }

    // Listen for messages from content script
    const handleMessage = (message: any, sender: any, sendResponse: any) => {
      if (message.type === 'GET_EXTENSION_DATA') {
        // Send extension data back to content script
        const extensionData = {
          tabInfo: currentTab,
          count: count,
          timestamp: new Date().toISOString(),
          extensionVersion: '1.0.0'
        };
        
        sendResponse(extensionData);
        console.log(sender)
      }
    };

    if (chrome?.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage);
      
      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }
  }, [currentTab, count])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>My React Extension</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current Tab:</h3>
        <p><strong>Title:</strong> {currentTab.title || 'Unknown'}</p>
        <p><strong>URL:</strong> {currentTab.url || 'Unknown'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p>Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Increment
        </button>
      </div>

      <button
        onClick={() => {
          if (currentTab.url) {
            navigator.clipboard.writeText(currentTab.url)
            alert('URL copied to clipboard!')
          }
        }}
        style={{
          padding: '8px 16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Copy URL
      </button>
    </div>
  )
}

export default App;
