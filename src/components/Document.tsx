import { useNavigate } from "react-router-dom";

import { truncateString } from "../utils/format/format";

interface DataItem {
  builder: string;
  collection: string;
  document: string;
}

function Document({ item }: { item: DataItem }) {
  const navigate = useNavigate();

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
    >
      {/* Builder */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-500 uppercase">Builder</span>
          <button
            onClick={() => copyToClipboard(item.builder)}
            className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
            title="Copy builder"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <code className="text-xs font-mono text-gray-700 break-all">
          {truncateString(item.builder, 35)}
        </code>
      </div>

      {/* Collection */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-500 uppercase">Collection</span>
          <button
            onClick={() => copyToClipboard(item.collection)}
            className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
            title="Copy collection"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <code className="text-xs font-mono text-gray-700">
          {item.collection}
        </code>
      </div>

      {/* Document */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-500 uppercase">Document</span>
          <button
            onClick={() => copyToClipboard(item.document)}
            className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
            title="Copy document"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <code className="text-xs font-mono text-gray-700">
          {item.document}
        </code>
      </div>

      {/* View Details Button */}
      <button
        onClick={() => navigate(`/data/${item.collection}/${item.document}`)}
        className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        View Full Details
      </button>
    </div>
  )
}

export default Document;
