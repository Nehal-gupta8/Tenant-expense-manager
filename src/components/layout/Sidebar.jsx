// src/components/layout/Sidebar.js
import { Link, useLocation } from "react-router-dom";
import { Building, ChartPie, Users, File, ChartBar, Settings } from "lucide-react";
import './Sidebar.css';

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartPie },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Bills & Payments", href: "/bills", icon: File },
 
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">
          <Building className="logo-icon" />
          TenantManager 
        </h1>
      </div>
      
      <nav className="nav">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="user-panel">
        <div className="user-avatar">JD</div>
        <div>
          <p className="user-name">John Doe</p>
          <p className="user-role">Property Owner</p>
        </div>
      </div>
    </aside>
  );
}