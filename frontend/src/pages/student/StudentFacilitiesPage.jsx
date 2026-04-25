import React, { useEffect, useState, useMemo } from 'react';
import TopBar from '../../Components/layout/TopBar';
import Sidebar from '../../Components/layout/Sidebar';
import { getAllFacilities } from '../../services/facilityService';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = "http://localhost:8080";
const DEFAULT_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="#e2e8f0"/><text x="200" y="125" text-anchor="middle" dominant-baseline="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="24">No Image</text></svg>`
)}`;

const StudentFacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);
  
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

    fetchFacilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleBookNow = (facility) => {
    // Placeholder for future booking development
    alert(`Booking flow for ${facility.name} is not yet implemented.`);
  };

  const handleViewDetails = (facility) => {
    setSelectedFacility(facility);
  };

  const closeModal = () => {
    setSelectedFacility(null);
  };

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
          <div className="w-full max-w-6xl">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Available Facilities</h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Browse and book available campus facilities.
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFacilities.map((facility) => (
                  <div 
                    key={facility.id} 
                    className="bg-[var(--color-surface)] rounded-[12px] border border-[var(--color-border)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Facility Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img 
                        src={facility.imageUrl ? `${BASE_URL}${facility.imageUrl}` : DEFAULT_IMAGE}
                        alt={facility.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_IMAGE;
                        }}
                      />
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                        facility.status === 'ACTIVE' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-white'
                      }`}>
                        {facility.status}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h3 className="text-lg font-semibold text-[var(--color-text)]" title={facility.name}>
                          {facility.name}
                        </h3>
                        <span className="inline-flex shrink-0 items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {facility.type}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm text-[var(--color-text)] flex-1">
                        <div className="flex justify-between">
                          <span className="text-[var(--color-text-muted)]">Category:</span>
                          <span className="font-medium">{facility.category || '-'}</span>
                        </div>
                        {facility.type !== 'GROUND' && (
                          <div className="flex justify-between">
                            <span className="text-[var(--color-text-muted)]">Capacity:</span>
                            <span className="font-medium">{facility.capacity || '-'}</span>
                          </div>
                        )}
                        {facility.location && (
                          <div className="flex justify-between">
                            <span className="text-[var(--color-text-muted)]">Location:</span>
                            <span className="font-medium">{facility.location}</span>
                          </div>
                        )}
                      </div>
                      
                      {facility.description && (
                        <div className="mb-4">
                          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2" title={facility.description}>
                            {facility.description}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => handleBookNow(facility)}
                          disabled={facility.status !== 'ACTIVE'}
                          className={`flex-1 py-2.5 px-4 rounded-[8px] font-semibold text-sm transition-all ${
                            facility.status === 'ACTIVE'
                              ? 'bg-[var(--color-primary)] text-white shadow-sm hover:opacity-90'
                              : 'bg-gray-200 text-[var(--color-text-muted)] cursor-not-allowed'
                          }`}
                        >
                          {facility.status === 'ACTIVE' ? 'Book Now' : 'Not Available'}
                        </button>
                        <button
                          onClick={() => handleViewDetails(facility)}
                          className="py-2.5 px-4 rounded-[8px] font-semibold text-sm bg-gray-100 text-[var(--color-text)] hover:bg-gray-200 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Details Modal */}
      {selectedFacility && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative h-64 overflow-hidden bg-gray-100">
              <img 
                src={selectedFacility.imageUrl ? `${BASE_URL}${selectedFacility.imageUrl}` : DEFAULT_IMAGE}
                alt={selectedFacility.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">{selectedFacility.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedFacility.status === 'ACTIVE' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  {selectedFacility.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-muted)]">Type</p>
                  <p className="text-[var(--color-text)]">{selectedFacility.type}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-muted)]">Category</p>
                  <p className="text-[var(--color-text)]">{selectedFacility.category}</p>
                </div>
                {selectedFacility.type !== 'GROUND' && (
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-muted)]">Capacity</p>
                    <p className="text-[var(--color-text)]">{selectedFacility.capacity} people</p>
                  </div>
                )}
                {selectedFacility.location && (
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-muted)]">Location</p>
                    <p className="text-[var(--color-text)]">{selectedFacility.location}</p>
                  </div>
                )}
              </div>

              {selectedFacility.description && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">Description</p>
                  <p className="text-[var(--color-text)]">{selectedFacility.description}</p>
                </div>
              )}

              <button 
                className="w-full py-3 px-4 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={() => {
                  handleBookNow(selectedFacility);
                  closeModal();
                }}
                disabled={selectedFacility.status !== 'ACTIVE'}
              >
                {selectedFacility.status === 'ACTIVE' ? 'Book This Facility' : 'Not Available'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFacilitiesPage;
