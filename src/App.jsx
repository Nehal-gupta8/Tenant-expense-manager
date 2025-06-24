// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Bills from './pages/Bills';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/bills" element={<Bills />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}