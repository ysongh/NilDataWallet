import { HashRouter, Route, Routes } from "react-router-dom";

import CreateDID from "./pages/CreateDID";
import ReadCollection from "./pages/ReadCollection";
import Test from "./pages/Test";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/createdid"
          element={<CreateDID />} />
        <Route
          path="/test"
          element={<Test />} />
        <Route
          path="/"
          element={<ReadCollection />} />
      </Routes>
    </HashRouter>
  )
}

export default App
