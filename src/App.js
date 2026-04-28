import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Experience from "./pages/Experience";
import Contact from "./pages/Contact";
import Portfolio from "./pages/Portfolio";
import Ressources from "./pages/Ressources";
// import TmpDisabled from "./pages/TmpDisabled";
import Simulateur from "./pages/Simulateur";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/ressources" element={<Ressources />} />
                <Route path="/res" element={<Ressources />} />
                <Route path="/mcc" element={<Simulateur />} />
                <Route path="*" element={<Home />} />
            </Routes>
            <Analytics />
            <SpeedInsights />
        </Router>
    );
}

export default App;
