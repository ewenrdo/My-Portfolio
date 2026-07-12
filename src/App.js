import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Ressources from "./pages/Ressources";
import Simulateur from "./pages/Simulateur";
import NotFound from "./pages/NotFound";
import Maintenance from "./pages/Maintenance";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import MaintenanceRessources from "./pages/MaintenanceRessources";

const App = () => {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/ressources" element={<Ressources />} />
                <Route path="/mcc" element={<MaintenanceRessources />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Analytics />
            <SpeedInsights />
        </Router>
    );
}

export default App;
