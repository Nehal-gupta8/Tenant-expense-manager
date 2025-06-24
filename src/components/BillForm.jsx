// src/components/BillForm.js
import { useState } from 'react';
import './BillForm.css';

const billTypes = [
  "Monthly Rent",
  "Utilities",
  "Maintenance", 
  "Cleaning Fee",
  "Late Fee",
  "Other"
];

export default function BillForm({ onSubmit, onCancel, tenants, initialData, isLoading }) {
  const [formData, setFormData] = useState({
    tenantId: initialData?.tenantId || 0,
    type: initialData?.type || "",
    amount: initialData?.amount || "0",
    dueDate: initialData?.dueDate || "",
    status: initialData?.status || "pending",
    paidDate: initialData?.paidDate || "",
    description: initialData?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const billData = {
      id: initialData?.id || Date.now(),
      ...formData,
      tenantId: parseInt(formData.tenantId)
    };
    onSubmit(billData);
  };

  return (
    <form onSubmit={handleSubmit} className="bill-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Tenant *</label>
          <select
            name="tenantId"
            value={formData.tenantId}
            onChange={handleChange}
            required
          >
            <option value="">Select Tenant</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name} - Room {tenant.roomNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Bill Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Bill Type</option>
            {billTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount *</label>
          <div className="currency-input">
            <span>₹</span>
            <input
              type="number"
              name="amount"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Due Date *</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="form-group">
          <label>Paid Date</label>
          <input
            type="date"
            name="paidDate"
            value={formData.paidDate}
            onChange={handleChange}
            disabled={formData.status !== 'paid'}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          rows={3}
          name="description"
          placeholder="Additional details about this bill..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Bill" : "Create Bill"}
        </button>
      </div>
    </form>
  );
}