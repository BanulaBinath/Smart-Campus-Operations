import React, { useEffect, useState, useMemo } from 'react';
import TopBar from '../../components/layout/TopBar';
import Sidebar from '../../components/layout/Sidebar';
import { getAllFacilities } from '../../services/facilityService';
import { useAuth } from '../../components/context/AuthContext';

const StudentFacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const { user } = useAuth();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const data = await getAllFacilities();
        
        let visibleFacilities = data;

        // Filter out Classroom and Lab types for Students and Users
        if (user?.role === 'STUDENT' || user?.role === 'USER') {
          visibleFacilities = data.filter(
            (facility) => 
              facility.type?.toUpperCase() !== 'CLASSROOM' && 
              facility.type?.toUpperCase() !== 'LAB'
          );
        }
        
        setFacilities(visibleFacilities);
      } catch (err) {
        setError('Failed to load facilities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchFacilities();
  }, [user]);

  // Derive unique types and statuses for dropdowns
  const availableTypes = useMemo(() => {
    const types = new Set(facilities.map(f => f.type?.toUpperCase() || 'UNKNOWN'));
    return ['ALL', ...Array.from(types).sort()];
  }, [facilities]);

  const availableStatuses = useMemo(() => {
    const statuses = new Set(facilities.map(f => f.status?.toUpperCase() || 'UNKNOWN'));
    return ['ALL', ...Array.from(statuses).sort()];
  }, [facilities]);

  // Apply filters
  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => {
      const typeMatch = selectedType === 'ALL' || (f.type?.toUpperCase() || 'UNKNOWN') === selectedType;
      const statusMatch = selectedStatus === 'ALL' || (f.status?.toUpperCase() || 'UNKNOWN') === selectedStatus;
      return typeMatch && statusMatch;
    });
  }, [facilities, selectedType, selectedStatus]);

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="Campus Facilities" />
        
        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Available Facilities</h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Browse and view available campus facilities.
                </p>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-[var(--color-surface)] p-4 rounded-[12px] border border-[var(--color-border)] shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="typeFilter" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  Filter by Type
                </label>
                <select
                  id="typeFilter"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-[var(--color-border)] rounded-[8px] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none text-sm"
                >
                  {availableTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="statusFilter" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  Filter by Status
                </label>
                <select
                  id="statusFilter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-[var(--color-border)] rounded-[8px] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none text-sm"
                >
                  {availableStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
              </div>
            ) : filteredFacilities.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-[var(--color-surface)] rounded-[12px] border border-[var(--color-border)] border-dashed border-2">
                <h2 className="text-lg font-semibold text-[var(--color-text)]">No Facilities Found</h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                  There are no facilities matching your current filters.
                </p>
                {(selectedType !== 'ALL' || selectedStatus !== 'ALL') && (
                  <button 
                    onClick={() => { setSelectedType('ALL'); setSelectedStatus('ALL'); }}
                    className="mt-4 text-[var(--color-primary)] text-sm font-semibold hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFacilities.map((facility) => (
                  <div 
                    key={facility.id} 
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col"
                  >
                    {/* Optional Image Section */}
                    {facility.imageUrl && (
                      <div className="h-48 w-full bg-gray-100 overflow-hidden">
                        <img 
                          src={facility.imageUrl} 
                          alt={facility.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4 gap-3">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2" title={facility.name}>
                          {facility.name}
                        </h3>
                        <span className="inline-flex shrink-0 items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                          {facility.type || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-5 text-sm text-gray-600 flex-1">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-gray-500 font-medium">Location</span>
                          <span className="font-semibold text-gray-800 text-right">{facility.location || facility.category || 'TBD'}</span>
                        </div>
                        {facility.type !== 'GROUND' && (
                          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-gray-500 font-medium">Capacity</span>
                            <span className="font-semibold text-gray-800">{facility.capacity || 'N/A'}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 font-medium">Status</span>
                          <span className={`font-semibold px-2 py-0.5 rounded text-xs ${
                            facility.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {facility.status || 'UNKNOWN'}
                          </span>
                        </div>
                      </div>
                      
                      {facility.description && (
                        <div className="mt-auto pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed" title={facility.description}>
                            {facility.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentFacilitiesPage;
