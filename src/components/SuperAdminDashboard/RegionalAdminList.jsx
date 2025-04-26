import React from 'react';
import {
  useGetRegionalAdminsQuery,
  useGetPendingAdminsQuery,
} from '../../redux/superadminRegionalAdminApi'; // ✅ correct import

const RegionalAdminList = () => {
  const { data: regionalAdmins = [], isLoading: loadingRegional, isError: errorRegional } = useGetRegionalAdminsQuery();
  const { data: pendingAdmins = [], isLoading: loadingPending, isError: errorPending } = useGetPendingAdminsQuery();

  const isLoading = loadingRegional || loadingPending;
  const isError = errorRegional || errorPending;

  if (isLoading) return <div>Loading regional admins...</div>;
  if (isError) return <div>Error fetching regional admins.</div>;

  // Merge approved + pending admins
  const allAdmins = [
    ...regionalAdmins.map(admin => ({ ...admin, status: 'Approved' })),  // All admins are now approved
    ...pendingAdmins.map(admin => ({ ...admin, status: 'Pending' })),
  ];

  return (
    <div>
      <h2>All Regional Admins</h2>
      <ul>
        {allAdmins.map((admin) => (
          <li key={admin._id}>
            {admin.name} — {admin.email} — {admin.region} — Sellers: {admin.sellers_count ?? 0} — Status: {admin.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegionalAdminList;
