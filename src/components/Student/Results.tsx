import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, Target, TrendingUp } from 'lucide-react';
import { TestResult, Ranking } from '../../types';
import { apiService } from '../../services/api';

const Results: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resultsData, rankingsData] = await Promise.all([
          apiService.getResults(),
          apiService.getRankings()
        ]);
        setResults(resultsData);
        setRankings(rankingsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Assessment Results</h2>
        <p className="text-sm sm:text-base text-gray-600 px-4">Your performance and rankings</p>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Test Results
        </h3>
        
        {results.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No test results yet. Take a test to see your results here.</p>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {result.category.charAt(0).toUpperCase() + result.category.slice(1)} - {result.subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h4>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right sm:text-center">
                    <div className={`text-2xl font-bold ${getGradeColor((result.score / result.totalQuestions) * 100)}`}>
                      {getGrade((result.score / result.totalQuestions) * 100)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.score}/{result.totalQuestions}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1 text-blue-500" />
                    <span>Score: {result.score}/{result.totalQuestions}</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                    <span>Percentage: {((result.score / result.totalQuestions) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-orange-500" />
                    <span>Time: {formatTime(result.timeTaken)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                    <span>{new Date(result.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rankings */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Rankings
        </h3>
        
        {rankings.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No rankings available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Rank</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Name</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">Reg. No.</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Tests</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">Score</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">%</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((ranking, index) => (
                  <tr key={ranking._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">
                      {index + 1}
                      {index === 0 && <Trophy className="h-3 w-3 sm:h-4 sm:w-4 inline ml-1 sm:ml-2 text-yellow-500" />}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 truncate max-w-24 sm:max-w-none">{ranking.name}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">{ranking.regno}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">{ranking.testsCount}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">{ranking.totalScore}/{ranking.totalQuestions}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span className={`font-medium ${getGradeColor(ranking.percentage)}`}>
                        {ranking.percentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;

//       {/* Test Results */}
//       <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
//         <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
//           <Target className="h-5 w-5 mr-2" />
//           Test Results
//         </h3>
        
//         {results.length === 0 ? (
//           <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No test results yet. Take a test to see your results here.</p>
//         ) : (
//           <div className="space-y-4">
//             {results.map((result) => (
//               <div key={result._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
//                   <div>
//                     <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
//                       {result.category.charAt(0).toUpperCase() + result.category.slice(1)} - {result.subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                     </h4>
//                     <p className="text-sm text-gray-500 flex items-center">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       {new Date(result.submittedAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="text-right sm:text-center">
//                     <div className={`text-2xl font-bold ${getGradeColor((result.score / result.totalQuestions) * 100)}`}>
//                       {getGrade((result.score / result.totalQuestions) * 100)}
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       {result.score}/{result.totalQuestions}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
//                   <div className="flex items-center">
//                     <Target className="h-4 w-4 mr-1 text-blue-500" />
//                     <span>Score: {result.score}/{result.totalQuestions}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
//                     <span>Percentage: {((result.score / result.totalQuestions) * 100).toFixed(1)}%</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Clock className="h-4 w-4 mr-1 text-orange-500" />
//                     <span>Time: {formatTime(result.timeTaken)}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Calendar className="h-4 w-4 mr-1 text-purple-500" />
//                     <span>{new Date(result.submittedAt).toLocaleDateString()}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Rankings */}
//       <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
//         <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
//           <Trophy className="h-5 w-5 mr-2" />
//           Rankings
//         </h3>
        
//         {rankings.length === 0 ? (
//           <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No rankings available yet.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-xs sm:text-sm">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Rank</th>
//                   <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Name</th>
//                   <th className="text-left py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">Reg. No.</th>
//                   <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Tests</th>
//                   <th className="text-left py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">Score</th>
//                   <th className="text-left py-2 sm:py-3 px-2 sm:px-4">%</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rankings.map((ranking, index) => (
//                   <tr key={ranking._id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">
//                       {index + 1}
//                       {index === 0 && <Trophy className="h-3 w-3 sm:h-4 sm:w-4 inline ml-1 sm:ml-2 text-yellow-500" />}
//                     </td>
//                     <td className="py-2 sm:py-3 px-2 sm:px-4 truncate max-w-24 sm:max-w-none">{ranking.name}</td>
//                     <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">{ranking.regno}</td>
//                     <td className="py-2 sm:py-3 px-2 sm:px-4">{ranking.testsCount}</td>
//                     <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">{ranking.totalScore}/{ranking.totalQuestions}</td>
//                     <td className="py-2 sm:py-3 px-2 sm:px-4">
//                       <span className={`font-medium ${getGradeColor(ranking.percentage)}`}>
//                         {ranking.percentage.toFixed(1)}%
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Results;
