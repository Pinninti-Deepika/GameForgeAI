import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Characters from "./pages/Characters";
import Levels from "./pages/Levels";
import Gameplay from "./pages/Gameplay";
import VisualStyle from "./pages/VisualStyle";
import GameDesignDocument from "./pages/GameDesignDocument";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/generate" element={<Home />} />

        <Route path="/story" element={<Story />} />

        <Route
          path="/characters"
          element={<Characters />}
        />

        <Route
          path="/levels"
          element={<Levels />}
        />

        <Route
          path="/gameplay"
          element={<Gameplay />}
        />

        <Route
          path="/visual-style"
          element={<VisualStyle />}
        />

        <Route
          path="/game-design-document"
          element={<GameDesignDocument />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;