import { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import CreateDID from "./pages/CreateDID";
// import ReadCollection from "./pages/ReadCollection";
import MyData from "./pages/MyData";
import DataDetail from "./pages/DataDetail";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Setting from "./pages/Setting";
import UnlockDID from "./pages/UnlockDID";
import SeePrivateKey from "./pages/SeePrivateKey";

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  return (
    <HashRouter>
      <Navbar isLogin={isLogin} setIsLogin={setIsLogin} />
      <Routes>
        <Route
          path="/seeprivatekey"
          element={<SeePrivateKey />} />
        <Route
          path="/unlock"
          element={<UnlockDID setIsLogin={setIsLogin} />} />
        <Route
          path="/setting"
          element={<Setting />} />
        <Route
          path="/data/:collectionId/:documentId"
          element={<DataDetail />} />
        <Route
          path="/mydata"
          element={<MyData />} />
        <Route
          path="/createdid"
          element={<CreateDID setIsLogin={setIsLogin} />} />
        <Route
          path="/test"
          element={<Test />} />
        <Route
          path="/"
          element={<Home />} />
      </Routes>
    </HashRouter>
  )
}

export default App
