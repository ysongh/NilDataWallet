import { HashRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import CreateDID from "./pages/CreateDID";
import ReadCollection from "./pages/ReadCollection";
import MyData from "./pages/MyData";
import DataDetail from "./pages/DataDetail";
import Test from "./pages/Test";

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route
          path="/data/:collectionId/:documentId"
          element={<DataDetail />} />
        <Route
          path="/mydata"
          element={<MyData />} />
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
