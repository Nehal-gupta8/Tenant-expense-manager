// src/pages/Dashboard.js
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  Users, DollarSign, File, ChartPie, 
  UserPlus, FileDigit, Receipt, ChartBar 
} from 'lucide-react';
import Header from '../components/layout/Header';
import StatsCard from '../components/StatsCard';
import TenantForm from '../components/TenantForm';
import BillForm from '../components/BillForm';
import './Dashboard.css';

export default function Dashboard() {
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [tenants = [], setTenants] = useLocalStorage('tenants', []);
  const [bills = [], setBills] = useLocalStorage('bills', []);

  // Safe calculations with defaults
  const stats = {
    totalTenants: tenants.length,
    monthlyRevenue: tenants.reduce((sum, tenant) => {
      const amount = parseFloat(tenant?.monthlyRent) || 0;
      return sum + amount;
    }, 0),
    pendingBills: bills.filter(bill => bill?.status === 'pending').length,
    occupancyRate: Math.round((tenants.length / 15) * 100) // 15 rooms total
  };

  const recentTenants = tenants.slice(-3).reverse();
  const outstandingBills = bills.filter(bill => bill.status !== 'paid');

  const handleAddTenant = (tenantData) => {
    setTenants([...tenants, tenantData]);
    setShowAddTenant(false);
  };

  const handleCreateBill = (billData) => {
    setBills([...bills, billData]);
    setShowCreateBill(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'active-badge',
      inactive: 'inactive-badge',
      paid: 'paid-badge',
      pending: 'pending-badge',
      overdue: 'overdue-badge'
    };
    return (
      <span className={`badge ${statusClasses[status] || 'neutral-badge'}`}>
        {status?.charAt(0)?.toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  return (
    <>
      <Header
        title="Dashboard Overview"
        subtitle="Manage your tenants and track payments efficiently"
        onAddClick={() => setShowAddTenant(true)}
        addButtonText="Add Tenant"
      />

      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatsCard
            title="Total Tenants"
            value={stats.totalTenants}
            icon={Users}
            
            
            changeType="positive"
            iconBgColor="blue"
          />
          
          <StatsCard
            title="Monthly Revenue"
            value={formatCurrency(stats.monthlyRevenue)}
            icon={DollarSign}
            
            changeType="positive"
            iconBgColor="green"
          />
          
          <StatsCard
            title="Pending Bills"
            value={stats.pendingBills}
            icon={File}
            changeType="neutral"
            iconBgColor="amber"
          />
          
          <StatsCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            icon={ChartPie}
            change={`${stats.totalTenants}/15 rooms occupied`}
            changeType="positive"
            iconBgColor="purple"
          />
        </div>

        {/* Activity Grid */}
        <div className="activity-grid">
          {/* Recent Tenants */}
          <div className="recent-tenants">
            <div className="card">
              <div className="card-header">
                <h3>Recent Tenants</h3>
              </div>
              <div className="card-body">
                {recentTenants.length > 0 ? (
                  recentTenants.map(tenant => (
                    <div key={tenant.id} className="tenant-card">
                      <div className="tenant-avatar">
                        {tenant.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="tenant-info">
                        <p className="tenant-name">{tenant.name || 'Unknown Tenant'}</p>
                        <p className="tenant-details">
                          Room {tenant.roomNumber || 'N/A'} • {formatDate(tenant.leaseStartDate)}
                        </p>
                      </div>
                      <div className="tenant-status">
                        {getStatusBadge(tenant.status)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No tenants found</div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="card">
              <div className="card-header">
                <h3>Quick Actions</h3>
              </div>
              <div className="card-body">
                <button
                  className="action-button"
                  onClick={() => setShowAddTenant(true)}
                >
                  <div className="action-icon blue">
                    <UserPlus />
                  </div>
                  <span>Add New Tenant</span>
                </button>

                <button
                  className="action-button"
                  onClick={() => setShowCreateBill(true)}
                >
                  <div className="action-icon green">
                    <FileDigit />
                  </div>
                  <span>Create Bill</span>
                </button>

                

                
              </div>
            </div>
          </div>
        </div>

        {/* Outstanding Bills */}
        <div className="outstanding-bills">
          <div className="card">
            <div className="card-header">
              <h3>Outstanding Bills</h3>
            </div>
            <div className="card-body">
              {outstandingBills.length > 0 ? (
                <div className="bills-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Tenant</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outstandingBills.slice(0, 5).map(bill => {
                        const tenant = tenants.find(t => t.id === bill.tenantId) || {};
                        return (
                          <tr key={bill.id}>
                            <td>
                              <div className="tenant-cell">
                                <div className="tenant-avatar">
                                  {tenant.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                  <div className="tenant-name">{tenant.name || 'Unknown'}</div>
                                  <div className="tenant-room">Room {tenant.roomNumber || 'N/A'}</div>
                                </div>
                              </div>
                            </td>
                            <td>{formatCurrency(bill.amount)}</td>
                            <td>{formatDate(bill.dueDate)}</td>
                            <td>{getStatusBadge(bill.status)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">No outstanding bills</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Tenant Modal */}
      {showAddTenant && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Tenant</h3>
              <button 
                className="close-button" 
                onClick={() => setShowAddTenant(false)}
              >
                ×
              </button>
            </div>
            <TenantForm
              onSubmit={handleAddTenant}
              onCancel={() => setShowAddTenant(false)}
            />
          </div>
        </div>
      )}

      {/* Create Bill Modal */}
      {showCreateBill && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Bill</h3>
              <button 
                className="close-button" 
                onClick={() => setShowCreateBill(false)}
              >
                ×
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
    </>
  );
}