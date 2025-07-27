import React, { useState, useEffect } from 'react';
import { Users, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { User } from '../../types';
import { apiService } from '../../services/api';

const ViewUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Filters state
  const [yearFilter, setYearFilter] = useState<string>('');
  const [branchFilter, setBranchFilter] = useState<string>('');
  const [sectionFilter, setSectionFilter] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await apiService.getUsers();
      console.log('Fetched users:', data);
      // Map _id to id for compatibility
      const mappedUsers = data.map((user: any) => ({
        ...user,
        id: user._id,
      }));
      setUsers(mappedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    console.log('Deleting user with ID:', userId);
    if (!confirm('Are you sure you want to delete this student?')) return;

    setDeleteLoading(userId);
    try {
      await apiService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Get unique values for filters
  const uniqueYears = Array.from(new Set(users.map(user => user.year).filter(Boolean))) as string[];
  const uniqueBranches = Array.from(new Set(users.map(user => user.branch).filter(Boolean))) as string[];
  const uniqueSections = Array.from(new Set(users.map(user => user.section).filter(Boolean))) as string[];

  // Filter users based on selected filters
  const filteredUsers = users.filter(user => {
    return (
      (yearFilter === '' || user.year === yearFilter) &&
      (branchFilter === '' || user.branch === branchFilter) &&
      (sectionFilter === '' || user.section === sectionFilter)
    );
  });
  console.log('Filtered users count:', filteredUsers.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Student List ({filteredUsers.length})
        </h3>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap space-x-4">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All Years</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All Branches</option>
            {uniqueBranches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All Sections</option>
            {uniqueSections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No students found. Add some students to see them here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Name</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Reg. Number</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Year</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Branch</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Section</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Phone</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">Created</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  if (!user.id) {
                    console.warn('User without id found:', user);
                    return null;
                  }
                  return (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium truncate max-w-32 sm:max-w-none">{user.name}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.regno}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.year || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.branch || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.section || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.phone || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date().toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteLoading === user.id}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-800 disabled:opacity-50 text-xs sm:text-sm"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">{deleteLoading === user.id ? 'Deleting...' : 'Delete'}</span>
                          <span className="sm:hidden">Del</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;
