import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Experience from "./pages/Experience";
import Contact from "./pages/Contact";
import Portfolio from "./pages/Portfolio";
import Ressources from "./pages/Ressources";
// import TmpDisabled from "./pages/TmpDisabled";
import Simulateur from "./pages/Simulateur";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/ressources" element={<Ressources />} />
        <Route path="/res" element={<Ressources />} />
        <Route path="/mcc" element={<Simulateur />} />
      </Routes>
    </Router>
  );
}

export default App;
