import { HashRouter, Route, Routes } from "react-router-dom";

import ReadCollection from "./pages/ReadCollection";
import Test from "./pages/Test";

function App() {
  return (
    <HashRouter>
      <Routes>
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
