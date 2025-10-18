import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardShell } from "./components/Layout";
import DashboardOverview from "./pages/DashboardOverview";
import Markets from "./pages/Markets";
import Orders from "./pages/Orders";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import UiGallery from "./pages/UiGallery";

// Routes keep the dashboard shell persistent while exposing nested pages and the UI gallery showcase.
const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<DashboardShell />}>
				<Route index element={<DashboardOverview />} />
				<Route path="portfolio" element={<Portfolio />} />
				<Route path="markets" element={<Markets />} />
				<Route path="orders" element={<Orders />} />
				<Route path="settings" element={<Settings />} />
			</Route>
			<Route path="/ui" element={<UiGallery />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	</BrowserRouter>
);

export default App;
