import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Edit, Trash2, Eye } from 'lucide-react';
import Header from '../components/layout/Header';
import TenantForm from '../components/TenantForm';
import './Tenants.css';

export default function Tenants() {
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [viewingTenant, setViewingTenant] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenants, setTenants] = useLocalStorage('tenants', []);

  const handleAddTenant = (tenantData) => {
    setTenants([...tenants, { ...tenantData, id: Date.now() }]);
    setShowAddTenant(false);
  };

  const handleUpdateTenant = (tenantData) => {
    setTenants(tenants.map(tenant => 
      tenant.id === tenantData.id ? tenantData : tenant
    ));
    setEditingTenant(null);
  };

  const handleDeleteTenant = () => {
    setTenants(tenants.filter(tenant => tenant.id !== deletingId));
    setDeletingId(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(Number(amount || 0));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Ongoing";
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'active-badge',
      inactive: 'inactive-badge'
    };
    return (
      <span className={`badge ${statusClasses[status] || 'active-badge'}`}>
        {status?.charAt(0)?.toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  const filteredTenants = tenants.filter(tenant => {
    if (!tenant) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      tenant.name?.toLowerCase().includes(searchLower) ||
      tenant.roomNumber?.toLowerCase().includes(searchLower) ||
      tenant.phone?.includes(searchQuery) ||
      tenant.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="tenants-page">
      <Header
        title="Tenant Management"
        subtitle="View and manage all your tenants"
        onAddClick={() => setShowAddTenant(true)}
        addButtonText="Add Tenant"
        onSearch={setSearchQuery}
      />

      <div className="tenants-container">
        <div className="tenants-card">
          {filteredTenants.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? "No tenants found matching your search" : "No tenants added yet"}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="tenants-table">
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Room</th>
                    <th>Monthly Rent</th>
                    <th>Lease Period</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td>
                        <div className="tenant-info">
                          <div className="tenant-avatar">
                            {tenant.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="tenant-name">{tenant.name}</div>
                            <div className="tenant-phone">{tenant.phone}</div>
                            {tenant.email && (
                              <div className="tenant-email">{tenant.email}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>Room {tenant.roomNumber}</td>
                      <td>{formatCurrency(tenant.monthlyRent)}</td>
                      <td>
                        {formatDate(tenant.leaseStartDate)} - {formatDate(tenant.leaseEndDate)}
                      </td>
                      <td>{getStatusBadge(tenant.status)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="icon-button view"
                            onClick={() => setViewingTenant(tenant)}
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="icon-button edit"
                            onClick={() => setEditingTenant(tenant)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="icon-button delete"
                            onClick={() => setDeletingId(tenant.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddTenant && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Tenant</h3>
              <button className="close-button" onClick={() => setShowAddTenant(false)}>
                &times;
              </button>
            </div>
            <TenantForm
              onSubmit={handleAddTenant}
              onCancel={() => setShowAddTenant(false)}
            />
          </div>
        </div>
      )}

      {editingTenant && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Tenant</h3>
              <button className="close-button" onClick={() => setEditingTenant(null)}>
                &times;
              </button>
            </div>
            <TenantForm
              onSubmit={handleUpdateTenant}
              onCancel={() => setEditingTenant(null)}
              initialData={editingTenant}
            />
          </div>
        </div>
      )}

      {viewingTenant && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Tenant Details</h3>
              <button className="close-button" onClick={() => setViewingTenant(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <DetailItem label="Name" value={viewingTenant.name} />
                <DetailItem label="Room" value={`Room ${viewingTenant.roomNumber}`} />
                <DetailItem label="Phone" value={viewingTenant.phone} />
                <DetailItem label="Email" value={viewingTenant.email || "Not provided"} />
                <DetailItem label="Monthly Rent" value={formatCurrency(viewingTenant.monthlyRent)} />
                <DetailItem 
                  label="Security Deposit" 
                  value={viewingTenant.securityDeposit ? formatCurrency(viewingTenant.securityDeposit) : "Not specified"} 
                />
                <DetailItem label="Lease Start" value={formatDate(viewingTenant.leaseStartDate)} />
                <DetailItem label="Lease End" value={formatDate(viewingTenant.leaseEndDate)} />
              </div>

              {(viewingTenant.emergencyContactName || viewingTenant.emergencyContactPhone) && (
                <div className="detail-section">
                  <h4>Emergency Contact</h4>
                  <p>
                    {viewingTenant.emergencyContactName} 
                    {viewingTenant.emergencyContactPhone && ` - ${viewingTenant.emergencyContactPhone}`}
                  </p>
                </div>
              )}

              {viewingTenant.notes && (
                <div className="detail-section">
                  <h4>Notes</h4>
                  <p>{viewingTenant.notes}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setViewingTenant(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this tenant? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn secondary" onClick={() => setDeletingId(null)}>
                Cancel
              </button>
              <button className="btn danger" onClick={handleDeleteTenant}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <strong>{label}:</strong>
      <span>{value}</span>
    </div>
  );
}