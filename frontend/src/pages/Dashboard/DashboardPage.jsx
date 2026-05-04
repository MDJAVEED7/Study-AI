import React, { useEffect, useRef, useState } from 'react';
import Spinner from '../../components/common/Spinner';
import progressService from '../../services/progress.service.js';
import toast from 'react-hot-toast';
import { FileText, Dock, TrendingUp, BrainCircuit, Clock } from 'lucide-react';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDashboard = async () => {
      try {
        const fetchedData = await progressService.getDashboard();
        setDashboardData(fetchedData?.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (!dashboardData?.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground">
            No dashboard data available
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData?.overview?.documentCount || 0,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-700',
      bg: 'bg-blue-100',
    },
    {
      label: 'Total Flashcards',
      value: dashboardData?.overview?.flashcardsetCount || 0,
      icon: Dock,
      gradient: 'from-green-500 to-green-700',
      bg: 'bg-green-100',
    },
    {
      label: 'Total Quizzes',
      value: dashboardData?.overview?.quizzesCount || 0,
      icon: BrainCircuit,
      gradient: 'from-purple-500 to-purple-700',
      bg: 'bg-purple-100',
    },
  ];

  const activities = [
    ...(dashboardData?.recentActivity?.documents || []).map((doc) => ({
      id: doc._id,
      description: doc.title,
      timestamp: doc.lastAccessed || doc.createdAt,
      link: `/documents/${doc._id}`,
      type: 'document',
    })),
    ...(dashboardData?.recentActivity?.quizzes || []).map((quiz) => ({
      id: quiz._id,
      description: quiz.title,
      timestamp: quiz.completedAt || quiz.createdAt,
      isComplete: !!quiz.completedAt,
      link: `/quizzes/${quiz._id}`,
      type: 'quiz',
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Track your learning progress and recent activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg p-8 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {stat.label}
                </span>

                <div
                  className={`w-12 h-12 rounded-lg ${stat.bg} bg-gradient-to-br ${stat.gradient} shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="text-4xl font-bold text-foreground">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Recent Activity
            </h3>
          </div>

          {activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="group flex items-center justify-between p-5 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 hover:shadow-md hover:border-primary/20 transition-all duration-200"
                >
                  {/* Left content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.type === 'document'
                            ? 'bg-blue-500'
                            : 'bg-purple-500'
                        }`}
                      />
                      <p className="text-sm font-medium text-foreground truncate">
                        Accessed{' '}
                        {activity.type === 'document' ? 'Document' : 'Quiz'}:{' '}
                        <span className="font-semibold">
                          {activity.description}
                        </span>
                      </p>
                    </div>

                    <p className="text-xs text-gray-500 pl-6">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Right button */}
                  {activity.link && (
                    <a
                      href={activity.link}
                      className="ml-4 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-md transition-all duration-300 whitespace-nowrap"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gray-100 mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">
                No recent activity yet.
              </p>
              <p className="text-sm text-gray-600">
                Start learning to see your progress here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;