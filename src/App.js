import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Ressources from "./pages/Ressources";
import NotFound from "./pages/NotFound";
import Simulateur from "./pages/Simulateur";
import Cooldown from "./pages/Cooldown";
import November21 from "./pages/November21";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import AlimentationCochonInde from "./pages/guinea-pig/AlimentationGuineaPig";
import VisioCalendar from "./pages/VisioCalendar";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/ressources" element={<Ressources />} />
                <Route path="/21-november" element={<November21 />} />
                <Route path="/mcc" element={<Simulateur />} />
                <Route path="/holidays" element={<Cooldown />} />
                <Route path="/visio-calendar" element={<VisioCalendar />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/alimentation-cobaye" element={<AlimentationCochonInde />} />
            </Routes>
            <Analytics />
            <SpeedInsights />
        </Router>
    );
}

export default App;
