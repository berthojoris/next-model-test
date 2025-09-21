
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext, useDataContext } from '../context/AppContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { ClipboardListIcon, UserPlusIcon, CalendarIcon } from '../constants'; // Reusing icons

const InfoCard = ({ title, value, icon, gradient }: { title: string, value: string | number, icon: React.ReactNode, gradient: string }) => (
  <div className="glass-card p-6 rounded-2xl flex items-center shadow-lg border-t-2 border-l-2 border-white/10">
    <div className={`p-4 rounded-xl mr-5 ${gradient}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
    const { dbReady } = useAppContext();
    const { submissionsToday, pendingSyncCount } = useDataContext();

    const completionRate = useLiveQuery(async () => {
        if (!dbReady) return 'N/A'; // Wait for DB to be ready
        try {
            const [regular, event] = await Promise.all([
                db.surveyRegularResponses.count(),
                db.surveyEventResponses.count()
            ]);
            const total = regular + event;
            return total > 0 ? '98.7%' : 'N/A'; // Mocked completion rate
        } catch (error) {
            console.error("Failed to fetch completion rate:", error);
            return 'N/A';
        }
    }, [dbReady], 'N/A');

    const chartData = useLiveQuery(async () => {
        if (!dbReady) return []; // Wait for DB to be ready
        try {
            const data = [];
            const today = new Date();
            for (let i = 29; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);

                const count = await Promise.all([
                    db.surveyors.where('createdAt').between(startOfDay, endOfDay).count(),
                    db.surveyRegularResponses.where('createdAt').between(startOfDay, endOfDay).count(),
                    db.surveyEventResponses.where('createdAt').between(startOfDay, endOfDay).count()
                ]).then(counts => counts.reduce((a, b) => a + b, 0));

                data.push({
                    name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    submissions: count
                });
            }
            return data;
        } catch (error) {
            console.error("Failed to fetch chart data:", error);
            return []; // Return empty array on error
        }
    }, [dbReady]);

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard title="Total Submissions Today" value={submissionsToday} icon={<ClipboardListIcon />} gradient="bg-gradient-to-br from-green-400 to-teal-500" />
                <InfoCard title="Pending Sync" value={pendingSyncCount} icon={<UserPlusIcon />} gradient="bg-gradient-to-br from-yellow-400 to-orange-500" />
                <InfoCard title="Completion Rate" value={completionRate} icon={<CalendarIcon />} gradient="bg-gradient-to-br from-purple-500 to-pink-500" />
            </div>

            <div className="glass-card p-6 rounded-2xl shadow-lg h-[28rem] border-t-2 border-l-2 border-white/10">
                <h2 className="text-xl font-semibold mb-4 text-white">Daily Submission Trends (Last 30 Days)</h2>
                {chartData ? (
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" stroke="rgb(156 163 175)" />
                            <YAxis stroke="rgb(156 163 175)" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(20, 20, 30, 0.8)', 
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#e5e7eb',
                                borderRadius: '10px'
                              }} 
                            />
                            <Legend wrapperStyle={{ color: '#e5e7eb' }}/>
                            <defs>
                                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0072ff" stopOpacity={0.3}/>
                                </linearGradient>
                            </defs>
                            <Line type="monotone" dataKey="submissions" stroke="url(#colorSubmissions)" strokeWidth={3} activeDot={{ r: 8, fill: '#00c6ff', stroke: 'rgba(0,0,0,0.2)' }} dot={{stroke: '#0072ff', strokeWidth: 1, r: 4}} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex justify-center items-center h-full text-gray-400">Loading chart data...</div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
