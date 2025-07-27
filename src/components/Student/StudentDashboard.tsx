import React, { useState } from 'react';
import Header from '../Layout/Header';
import TestCategories from './TestCategories';
import TestInstructions from './TestInstructions';
import TestInterface from './TestInterface';
import Results from './Results';
import Assignments from './Assignments';

const semesterSubjects: Record<string, { value: string; label: string }[]> = {
  sem3: [
    { value: 'dmgt', label: 'Discrete Mathematics' },
    { value: 'mefa', label: 'Managerial Economics & Financial Analysis' },
    { value: 'CO', label: 'Computer Organisation' },
    { value: 'adsa', label: 'Advanced Data Structures & Algorithms' },
    { value: 'dbms', label: 'Database Management Systems' },
    { value: 'adsa lab', label: 'Advanced Data Structures & Algorithms Lab' },
    { value: 'dbms lab', label: 'Database Management Systems Lab' },
    { value: 'python', label: 'Python Programming' },
  ],
  sem4: [
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'history', label: 'History' },
  ],
  sem5: [
    { value: 'ml', label: 'Machine Learning' },
    { value: 'cn', label: 'Computer Networks' },
    { value: 'atcd', label: 'Automata Theory & Compiler Design' },
    { value: 'ooad', label: 'Object Oriented Analysis & Design' },
    { value: 'ai', label: 'Artificial Intelligence' },
    { value: 'mpmc', label: 'Micro Processors & Micro Controllers' },
    { value: 'ml lab', label: 'Machine Learning Lab' },
    { value: 'cn lab', label: 'Computer Networks Lab' },
    { value: 'soft', label: 'Soft Skills' },
    { value: 'flutter', label: 'User Interface Design & Flutter' },
  ],
  sem6: [
    { value: 'geography', label: 'Geography' },
    { value: 'english', label: 'English' },
    { value: 'physics', label: 'Physics' },
  ],
  sem7: [
    { value: 'cns', label: 'Cryptography & Network Security' },
    { value: 'nlp', label: 'Natural Language Processing' },
    { value: 'cv', label: 'Computer Vision' },
    { value: 'app', label: 'Advanced Python Programming' },
  ],
  sem8: [
    { value: 'biology', label: 'Biology' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
  ],
};

const categories = [
  {
    value: 'coding',
    label: 'Coding',
    subcategories: [
      { value: 'c', label: 'C Programming' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'web-development', label: 'Web Development' },
    ],
  },
  {
    value: 'aptitude-reasoning',
    label: 'Aptitude & Reasoning',
    subcategories: [
      { value: 'numbers', label: 'Numbers' },
      { value: 'series', label: 'Series' },
      { value: 'sequence', label: 'Sequence' },
    ],
  },
  {
    value: 'english',
    label: 'English',
    subcategories: [
      { value: 'parts-of-speech', label: 'Parts of Speech' },
      { value: 'article', label: 'Article' },
      { value: 'preposition', label: 'Preposition' },
    ],
  },
  
  {
    value: 'courses',
    label: 'Courses',
  },
];

const yearOptions = [
  { value: '2nd', label: '2ND YEAR' },
  { value: '3rd', label: '3RD YEAR' },
  { value: '4th', label: '4TH YEAR' },
];

const semesterOptions: Record<string, { value: string; label: string }[]> = {
  '2nd': [
    { value: 'sem3', label: 'Semester 3' },
    { value: 'sem4', label: 'Semester 4' },
  ],
  '3rd': [
    { value: 'sem5', label: 'Semester 5' },
    { value: 'sem6', label: 'Semester 6' },
  ],
  '4th': [
    { value: 'sem7', label: 'Semester 7' },
    { value: 'sem8', label: 'Semester 8' },
  ],
};

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState<'categories' | 'instructions' | 'test' | 'assignments'>('categories');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'assignments', label: 'Assignments' },
    { key: 'assessment', label: 'Result' },
  ];

  const handleCategorySelect = (category: string, subcategory: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setCurrentView('instructions');
  };

  const handleStartTest = () => {
    setCurrentView('test');
  };

  const handleTestComplete = (result: any) => {
    setTestResult(result);
    setCurrentView('categories');
    setActiveTab('assessment');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory('');
    setSelectedSubcategory('');
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setSelectedSemester('');
    setSelectedSubject('');
  };

  const handleSemesterSelect = (semester: string) => {
    setSelectedSemester(semester);
    setSelectedSubject('');
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
  };

  const renderContent = () => {
    if (activeTab === 'assessment') {
      return (
        <Results />
      );
    }

    if (activeTab === 'assignments') {
      return (
        <Assignments
          year={selectedYear}
          semester={selectedSemester}
          subject={selectedSubject}
          onYearSelect={handleYearSelect}
          onSemesterSelect={handleSemesterSelect}
          onSubjectSelect={handleSubjectSelect}
        />
      );
    }

    if (currentView === 'test') {
      return (
        <TestInterface
          category={selectedCategory}
          subcategory={selectedSubcategory}
          onTestComplete={handleTestComplete}
          onBack={handleBackToCategories}
        />
      );
    }

    if (currentView === 'instructions') {
      return (
        <TestInstructions
          category={selectedCategory}
          subcategory={selectedSubcategory}
          onStartTest={handleStartTest}
          onBack={handleBackToCategories}
        />
      );
    }

    return <TestCategories
      onCategorySelect={handleCategorySelect}
      categories={categories}
      semesterSubjects={semesterSubjects}
      semesterOptions={semesterOptions}
      yearOptions={yearOptions}
    />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {testResult && activeTab === 'assessment' && (
          <div className="mb-4 sm:mb-8 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <div className="text-green-600 font-semibold text-sm sm:text-base">Test Completed!</div>
              <div className="text-green-600 text-sm sm:text-base">
                Score: {testResult.score}/{testResult.totalQuestions} ({testResult.percentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;
