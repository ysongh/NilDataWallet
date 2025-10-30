import { useNavigate } from "react-router-dom";

function ExportModal({ setShowExportModal } : { setShowExportModal: Function}) {
  const navigate = useNavigate();

  const handleExportDID = (): void => {
    console.log('Exporting DID...');
    navigate("/seeprivatekey");
    setShowExportModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-800 mb-2">Export DID</h3>
          <p className="text-xs text-gray-600 mb-4">
            Your DID will be exported as a secure file. Keep it safe and don't share it with anyone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowExportModal(false)}
              className="flex-1 py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded-md transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleExportDID}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal;
