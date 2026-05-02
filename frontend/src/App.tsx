import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { TemperatureMonitoring } from './pages/Temperature';
import { EnergyManagement } from './pages/Energy';
import { HeatManagement } from './pages/Heat';
import { AlertCenter } from './pages/Alerts';
import { SystemSettings } from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="temperature" element={<TemperatureMonitoring />} />
            <Route path="energy" element={<EnergyManagement />} />
            <Route path="heat" element={<HeatManagement />} />
            <Route path="alerts" element={<AlertCenter />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}
