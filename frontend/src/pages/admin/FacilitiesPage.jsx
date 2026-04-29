import React, { useState } from 'react';
import TopBar from '../../Components/layout/TopBar';
import Sidebar from '../../Components/layout/Sidebar';
import Facility from '../../Components/admin/Facility';
import AddFacility from '../../Components/admin/addFacility';
import { useAuth } from '../../context/AuthContext';

const FacilitiesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' | 'add'

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="Facility Management" />
        
        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-5xl">
            {user?.role === 'ADMIN' ? (
              <>
                <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Facility Management</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      Manage facility records and add new campus spaces.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 bg-[var(--color-surface)] p-1 border border-[var(--color-border)] rounded-[10px]">
                    <button
                      onClick={() => setActiveTab('manage')}
                      className={`px-4 py-2 text-sm font-semibold transition-all rounded-[8px] ${
                        activeTab === 'manage' 
                          ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                      }`}
                    >
                      Manage Facilities
                    </button>
                    <button
                      onClick={() => setActiveTab('add')}
                      className={`px-4 py-2 text-sm font-semibold transition-all rounded-[8px] ${
                        activeTab === 'add' 
                          ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                      }`}
                    >
                      Add Facility
                    </button>
                  </div>
                </div>

                <div className="bg-[var(--color-surface)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
                  {activeTab === 'manage' ? (
                    <Facility />
                  ) : (
                    <AddFacility onSuccess={() => setActiveTab('manage')} />
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-[var(--color-surface)] rounded-[12px] border border-[var(--color-border)] border-dashed border-2">
                <h2 className="text-lg font-semibold text-[var(--color-text)]">Facilities Overview</h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-md text-center">
                  This section is currently under development for technicians. Facility management actions are restricted to administrators.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacilitiesPage;
