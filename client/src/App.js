import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import LobbyPage from "./pages/LobbyPage";
import BlockCodePage from "./pages/BlockCodePage";
import "./pages/style.css";
//main app component
function App() {
  return (
    //router component enables client-side routing
    <Router>
      <div>
        {/*defining the routing structure for the app */}
        <Routes>
          {/*route for the Lobbypage */}
          <Route path="/" element={<LobbyPage />} />
          {/*route for the BlockCodePage */}
          <Route path="/block/:id" element={<BlockCodePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
