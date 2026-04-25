import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../Components/layout/Sidebar';
import TopBar from '../../Components/layout/TopBar';
import { getAllFacilities, getApiErrorMessage } from '../../services/facilityService';

const StudentFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFacilities = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getAllFacilities();
        setFacilities(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(getApiErrorMessage(error, 'Failed to load facilities.'));
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, []);

  const cards = useMemo(() => facilities.map((facility) => {
    const imageUrl = facility.imageUrl || facility.image || null;
    return {
      id: facility.id,
      name: facility.name || 'Unnamed Facility',
      description: facility.description || 'No description available.',
      status: (facility.status || 'UNKNOWN').toUpperCase(),
      imageUrl,
      type: facility.type || 'N/A',
      category: facility.category || 'N/A',
    };
  }), [facilities]);

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="Facilities" />

        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-6xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[var(--color-text)]">Campus Facilities</h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Browse available facilities across campus.
              </p>
            </div>

            {loading && (
              <div className="flex justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
              </div>
            )}

            {!loading && error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                {error}
              </div>
            )}

            {!loading && !error && cards.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 bg-[var(--color-surface)] rounded-[12px] border border-[var(--color-border)] border-dashed border-2">
                <h2 className="text-lg font-semibold text-[var(--color-text)]">No Facilities Found</h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">No facilities are available at the moment.</p>
              </div>
            )}

            {!loading && !error && cards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cards.map((facility) => (
                  <article
                    key={facility.id}
                    className="bg-[var(--color-surface)] rounded-[12px] border border-[var(--color-border)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden"
                  >
                    {facility.imageUrl ? (
                      <img
                        src={facility.imageUrl}
                        alt={facility.name}
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-40 w-full bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-sm font-semibold text-slate-500">
                        No Image Available
                      </div>
                    )}

                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] leading-tight">{facility.name}</h2>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
                            facility.status === 'ACTIVE'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {facility.status}
                        </span>
                      </div>

                      <p className="text-sm text-[var(--color-text-muted)]">{facility.description}</p>

                      <div className="pt-2 text-xs text-[var(--color-text-muted)] flex items-center justify-between">
                        <span>Type: {facility.type}</span>
                        <span>Category: {facility.category}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentFacilities;
