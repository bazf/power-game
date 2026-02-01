import { Navigate, Route, Routes } from "react-router-dom";
import ModeSelection from "./pages/ModeSelection.jsx";
import HostMode from "./pages/HostMode.jsx";
import ExpertTool from "./pages/ExpertTool.jsx";
import EnergyBalancing from "./components/screen1/EnergyBalancing.jsx";
import ShieldVerification from "./components/screen2/ShieldVerification.jsx";
import ReactorControl from "./components/screen3/ReactorControl.jsx";
import ShieldCalculator from "./components/screen2/ShieldCalculator.jsx";

export default function App() {
    return (
        <div className="min-h-screen bg-base text-ink">
            <Routes>
                <Route path="/" element={<ModeSelection />} />
                <Route path="/host" element={<HostMode />}>
                    <Route index element={<EnergyBalancing />} />
                    <Route path="energy" element={<EnergyBalancing />} />
                    <Route path="shield" element={<ShieldVerification />} />
                    <Route path="reactor" element={<ReactorControl />} />
                </Route>
                <Route path="/expert" element={<ExpertTool />}>
                    <Route index element={<ShieldCalculator />} />
                    <Route path="shield" element={<ShieldCalculator />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}
