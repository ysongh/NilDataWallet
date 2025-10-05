import { useState, useEffect } from 'react';
import { Keypair } from '@nillion/nuc';
import { SecretVaultUserClient } from '@nillion/secretvaults';

import { getLocalStorage } from '../utils/localStorage/localStorage';

interface TabInfo {
  title?: string;
  url?: string;
}

interface AccessRequest {
  id: number;
  origin: string;
  timestamp: number;
  type: string;
  message?: string;
}

function Requests() {
  const [currentTab, setCurrentTab] = useState<TabInfo>({})
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([])
  const [nillionDiD, setNillionDiD] = useState<string>("");
  const [nillionDiDObj, setNillionDiDObj] = useState<any>("");
  const [identity, setIdentity] = useState<any>("");

  useEffect(() => {
    const identity = getLocalStorage("apikey");
    if (identity) {
      //@ts-ignore
      setNillionDiD(identity.did);
      //@ts-ignore
      setNillionDiDObj(identity.didObj);
      setIdentity(identity);
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
      console.log(response);
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

  console.log(pendingRequests, "pendingRequests")

  const createData = async (requestId: number) => {
    console.log(pendingRequests[0])

    const userPrivateData = {
      _id: crypto.randomUUID(),
      name: "Coder",
      event_name: 'Hackathon',
      travel_date: '02/04/2025',
      departure_airport: 'John F. Kennedy International',
      destination: 'London Heathrow',
      gate_number: '1',
      additional_note: 'I like to read book'
    };

    const user = await SecretVaultUserClient.from({
      baseUrls: "https://nildb-stg-n1.nillion.network,https://nildb-stg-n2.nillion.network,https://nildb-stg-n3.nillion.network".split(','),
      keypair: Keypair.from(identity.privateKey),
    });
    // User uploads data and grants builder limited access
    // @ts-ignore
    const uploadResults = await user.createData(pendingRequests[0].delegationToken, {
       // @ts-ignore
      owner: nillionDiD,
      acl: {
         // @ts-ignore
        grantee: pendingRequests[0].builderDid, // Grant access to the builder
        read: true, // Builder can read the data
        write: false, // Builder cannot modify the data
        execute: true, // Builder can run queries on the data
      },
       // @ts-ignore
      collection: pendingRequests[0].collectionId,
      data: [userPrivateData],
    });

    console.log(uploadResults);

    chrome.runtime.sendMessage({
      type: 'CREATE_DATA_SUCCESS',
      requestId
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
              {request.type === "Get DID" ? <>
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
              </> :  <>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>
                    Data: {request.message}
                  </p>
                <button
                  onClick={() => createData(request.id)}
                  className="w-full py-3 px-4 rounded-md text-white font-medium transition-colors bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Data
                </button>
                </>
              }
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