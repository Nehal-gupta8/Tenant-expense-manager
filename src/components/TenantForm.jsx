// src/components/TenantForm.js
import { useState } from 'react';
import './TenantForm.css';

const availableRooms = [
  "101", "102", "103", "104", "105",
  "201", "202", "203", "204", "205",
  "301", "302", "303", "304", "305"
];

export default function TenantForm({ onSubmit, onCancel, initialData, isLoading }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    roomNumber: initialData?.roomNumber || "",
    monthlyRent: initialData?.monthlyRent || "0",
    securityDeposit: initialData?.securityDeposit || "0",
    leaseStartDate: initialData?.leaseStartDate || "",
    leaseEndDate: initialData?.leaseEndDate || "",
    emergencyContactName: initialData?.emergencyContactName || "",
    emergencyContactPhone: initialData?.emergencyContactPhone || "",
    notes: initialData?.notes || "",
    status: initialData?.status || "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tenantData = {
      id: initialData?.id || Date.now(),
      ...formData
    };
    onSubmit(tenantData);
  };

  return (
    <form onSubmit={handleSubmit} className="tenant-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter tenant's full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="tenant@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Room Number *</label>
          <select
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            required
          >
            <option value="">Select Room</option>
            {availableRooms.map(room => (
              <option key={room} value={room}>Room {room}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Monthly Rent *</label>
          <div className="currency-input">
            <span>₹</span>
            <input
              type="number"
              name="monthlyRent"
              step="100.00"
              placeholder="1000.00"
              value={formData.monthlyRent}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Security Deposit</label>
          <div className="currency-input">
            <span>$</span>
            <input
              type="number"
              name="securityDeposit"
              step="10.00"
              placeholder="1500.00"
              value={formData.securityDeposit}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Lease Start Date *</label>
          <input
            type="date"
            name="leaseStartDate"
            value={formData.leaseStartDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Lease End Date</label>
          <input
            type="date"
            name="leaseEndDate"
            value={formData.leaseEndDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="emergency-contact">
        <label>Emergency Contact</label>
        <div className="emergency-grid">
          <input
            type="text"
            name="emergencyContactName"
            placeholder="Contact Name"
            value={formData.emergencyContactName}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="emergencyContactPhone"
            placeholder="Contact Phone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Additional Notes</label>
        <textarea
          rows={3}
          name="notes"
          placeholder="Any additional information about the tenant..."
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Tenant" : "Add Tenant"}
        </button>
      </div>
    </form>
  );
}