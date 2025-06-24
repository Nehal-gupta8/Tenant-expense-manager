import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Edit, Trash2 } from 'lucide-react';
import Header from '../components/layout/Header';
import BillForm from '../components/BillForm';
import './Bills.css';

export default function Bills() {
  const [bills, setBills] = useLocalStorage('bills', []);
  const [tenants] = useLocalStorage('tenants', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [deletingBillId, setDeletingBillId] = useState(null);

  // Helper functions
  const formatCurrency = (amount) => {
    const amountNumber = Number(amount);
    if (isNaN(amountNumber)) return '$0.00';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amountNumber);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? 'Invalid Date' 
        : date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="badge unknown-badge">Unknown</span>;
    
    const statusLower = status.toLowerCase();
    const statusText = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    
    const statusClasses = {
      paid: 'paid-badge',
      pending: 'pending-badge',
      overdue: 'overdue-badge'
    };
    
    return (
      <span className={`badge ${statusClasses[statusLower] || 'unknown-badge'}`}>
        {statusText}
      </span>
    );
  };

  // Action handlers
  const handleCreateBill = (newBill) => {
    setBills([...bills, { ...newBill, id: Date.now() }]);
    setShowCreateBill(false);
  };

  const handleUpdateBill = (updatedBill) => {
    setBills(bills.map(bill => 
      bill.id === updatedBill.id ? updatedBill : bill
    ));
    setEditingBill(null);
  };

  const handleDeleteBill = () => {
    setBills(bills.filter(bill => bill.id !== deletingBillId));
    setDeletingBillId(null);
  };

  const handleMarkPaid = (billId) => {
    setBills(bills.map(bill => 
      bill.id === billId 
        ? { ...bill, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
        : bill
    ));
  };

  // Filter bills
  const filteredBills = bills.filter(bill => {
    const tenant = tenants.find(t => t.id === bill.tenantId) || {};
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = 
      (tenant.name || '').toLowerCase().includes(searchLower) ||
      (bill.type || '').toLowerCase().includes(searchLower) ||
      (tenant.roomNumber || '').toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || 
                         (bill.status || '').toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Tenant Cell Component
  const TenantCell = ({ tenantId, tenants }) => {
    if (!tenantId) return <td>No Tenant</td>;
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return <td>Unknown Tenant</td>;

    const initials = tenant.name 
      ? tenant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : '--';

    return (
      <td>
        <div className="tenant-cell">
          <div className="tenant-avatar">{initials}</div>
          <div className="tenant-info">
            <div className="tenant-name">{tenant.name || 'Unnamed Tenant'}</div>
            <div className="tenant-room">
              {tenant.roomNumber ? `Room ${tenant.roomNumber}` : 'No Room'}
            </div>
          </div>
        </div>
      </td>
    );
  };

  return (
    <>
      <Header
        title="Bills & Payments"
        subtitle="Manage tenant bills and track payments"
        onSearch={setSearchQuery}
        onAddClick={() => setShowCreateBill(true)}
        addButtonText="Create Bill"
      />

      <div className="bills-content">
        <div className="card">
          <div className="card-header">
            <div className="filters">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            {filteredBills.length === 0 ? (
              <div className="empty-state">
                {searchQuery || statusFilter !== 'all' 
                  ? "No bills found matching your filters" 
                  : "No bills created yet"}
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Tenant</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map(bill => (
                      <tr key={bill.id || Math.random()}>
                        <TenantCell tenantId={bill.tenantId} tenants={tenants} />
                        <td>{bill.type || 'No Type'}</td>
                        <td>{formatCurrency(bill.amount)}</td>
                        <td>{formatDate(bill.dueDate)}</td>
                        <td>{getStatusBadge(bill.status)}</td>
                        <td className="actions-cell">
                          <div className="action-buttons">
                            {bill.status !== 'paid' && (
                              <button
                                className="text-button green"
                                onClick={() => handleMarkPaid(bill.id)}
                              >
                                Mark Paid
                              </button>
                            )}
                            <button
                              className="icon-button"
                              onClick={() => setEditingBill(bill)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="icon-button danger"
                              onClick={() => setDeletingBillId(bill.id)}
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
      </div>

      {/* Create Bill Modal */}
      {showCreateBill && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Bill</h3>
              <button 
                className="close-button" 
                onClick={() => setShowCreateBill(false)}
              >
                &times;
              </button>
            </div>
            <BillForm
              onSubmit={handleCreateBill}
              onCancel={() => setShowCreateBill(false)}
              tenants={tenants}
            />
          </div>
        </div>
      )}

      {/* Edit Bill Modal */}
      {editingBill && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Bill</h3>
              <button 
                className="close-button" 
                onClick={() => setEditingBill(null)}
              >
                &times;
              </button>
            </div>
            <BillForm
              onSubmit={handleUpdateBill}
              onCancel={() => setEditingBill(null)}
              tenants={tenants}
              initialData={editingBill}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBillId && (
        <div className="modal-overlay">
          <div className="modal confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this bill? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn secondary" 
                onClick={() => setDeletingBillId(null)}
              >
                Cancel
              </button>
              <button 
                className="btn danger" 
                onClick={handleDeleteBill}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}