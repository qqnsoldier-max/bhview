import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardShell } from "./components/Layout";
import UiGallery from "./pages/UiGallery";

// Routes keep the dashboard as the default entry while exposing the UI gallery for rapid audits.
const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<DashboardShell />} />
			<Route path="/ui" element={<UiGallery />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	</BrowserRouter>
);

export default App;
