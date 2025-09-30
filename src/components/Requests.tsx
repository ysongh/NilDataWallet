import { useState, useEffect } from 'react';

import { getLocalStorage } from '../utils/localStorage/localStorage';

interface TabInfo {
  title?: string;
  url?: string;
}

interface AccessRequest {
  id: number;
  origin: string;
  timestamp: number;
}

function Requests() {
  const [currentTab, setCurrentTab] = useState<TabInfo>({})
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([])
  const [nillionDiD, setNillionDiD] = useState<string>("");
  const [nillionDiDObj, setNillionDiDObj] = useState<any>("");

  useEffect(() => {
    const identity = getLocalStorage("apikey");
    if (identity) {
      //@ts-ignore
      setNillionDiD(identity.did);
      //@ts-ignore
      setNillionDiDObj(identity.didObj);
    }
  }, [])

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

    // Get pending access requests
    chrome.runtime.sendMessage({ type: 'GET_PENDING_REQUESTS' }, (response) => {
      if (response?.requests) {
        setPendingRequests(response.requests)
      }
    })
  }, [])

  const handleAccessRequest = (requestId: number, granted: boolean) => {
    chrome.runtime.sendMessage({
      type: 'RESPOND_TO_REQUEST',
      requestId,
      granted,
      nillionDiD,
      nillionDiDObj
    })
    
    // Remove from local state
    setPendingRequests(prev => prev.filter(r => r.id !== requestId))
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>My React Extension</h1>
      
      {/* Access Requests Section */}
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Access Requests</h3>
          {pendingRequests.map(request => (
            <div key={request.id} style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{request.origin}</p>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>
                Requested: {new Date(request.timestamp).toLocaleTimeString()}
              </p>
              <button
                onClick={() => handleAccessRequest(request.id, true)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  marginRight: '8px',
                  fontSize: '12px'
                }}
              >
                Allow
              </button>
              <button
                onClick={() => handleAccessRequest(request.id, false)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Deny
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current Tab:</h3>
        <p><strong>Title:</strong> {currentTab.title || 'Unknown'}</p>
        <p><strong>URL:</strong> {currentTab.url || 'Unknown'}</p>
      </div>
    </div>
  )
}

export default Requests;
