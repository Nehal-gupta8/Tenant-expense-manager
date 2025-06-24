// src/components/layout/Header.js
import { Search, Plus } from "lucide-react";
import './Header.css';

export default function Header({ 
  title, 
  subtitle, 
  onAddClick, 
  addButtonText = "Add", 
  showSearch = true,
  onSearch 
}) {
  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h2 className="title">{title}</h2>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        <div className="actions">
          {showSearch && (
            <div className="search">
              <input
                type="search"
                placeholder="Search tenants, bills..."
                onChange={(e) => onSearch?.(e.target.value)}
              />
              <Search className="search-icon" />
            </div>
          )}
          {onAddClick && (
            <button onClick={onAddClick} className="add-button">
              <Plus className="add-icon" />
              <span>{addButtonText}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}