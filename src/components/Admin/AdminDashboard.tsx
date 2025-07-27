import React, { useState } from 'react';
import Header from '../Layout/Header';
import AddUser from './AddUser';
import ViewUsers from './ViewUsers';
import AddQuestions from './AddQuestions';
import ViewQuestions from './ViewQuestions';
import Results from '../Student/Results';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('add-logins');

  const tabs = [
    { key: 'add-logins', label: 'Add Logins' },
    { key: 'view-logins', label: 'View Logins' },
    { key: 'add-questions', label: 'Add Questions' },
    { key: 'view-questions', label: 'View Questions' },
    { key: 'rank-table', label: 'Rank Table' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'add-logins':
        return <AddUser />;
      case 'view-logins':
        return <ViewUsers />;
      case 'add-questions':
        return <AddQuestions />;
      case 'view-questions':
        return <ViewQuestions />;
      case 'rank-table':
        return <Results />;
      default:
        return <AddUser />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;