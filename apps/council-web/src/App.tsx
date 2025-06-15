import { BrowserRouter, Route, Routes } from "react-router";

import { HomePage } from "./pages/HomePage";
import { CardsPage } from "./pages/CardsPage";
import { ManaPage } from "./pages/ManaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mana" element={<ManaPage />} />
        <Route path="/card" element={<CardsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
