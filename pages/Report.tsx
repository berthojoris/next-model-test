
import React, { useState, useCallback } from 'react';
import { db } from '../services/db';

const Report: React.FC = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = useCallback(async () => {
        setIsExporting(true);
        try {
            // Correctly parse date strings to avoid timezone issues.
            // `new Date('YYYY-MM-DD')` can be interpreted as UTC, leading to off-by-one day errors.
            // Appending time ensures it's parsed in the local timezone.
            const start = startDate ? new Date(startDate + 'T00:00:00') : new Date(0);
            const end = endDate ? new Date(endDate + 'T23:59:59.999') : new Date();

            const surveyors = await db.surveyors.where('createdAt').between(start, end).toArray();
            const regularSurveys = await db.surveyRegularResponses.where('createdAt').between(start, end).toArray();
            const eventSurveys = await db.surveyEventResponses.where('createdAt').between(start, end).toArray();

            // Simple CSV generation
            const headers = 'type,id,status,createdAt,data\n';
            const surveyorRows = surveyors.map(s => `surveyor,${s.id},${s.status},${s.createdAt.toISOString()},"${JSON.stringify(s).replace(/"/g, '""')}"`).join('\n');
            const regularRows = regularSurveys.map(r => `regular_survey,${r.id},${r.status},${r.createdAt.toISOString()},"${JSON.stringify(r).replace(/"/g, '""')}"`).join('\n');
            const eventRows = eventSurveys.map(e => `event_survey,${e.id},${e.status},${e.createdAt.toISOString()},"${JSON.stringify(e).replace(/"/g, '""')}"`).join('\n');

            const csvContent = headers + [surveyorRows, regularRows, eventRows].filter(Boolean).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.href) {
                URL.revokeObjectURL(link.href);
            }
            link.href = URL.createObjectURL(blob);
            link.download = `SurveySync_Report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to export report:", error);
            alert("An error occurred while exporting the report. Please check the console for details.");
        } finally {
            setIsExporting(false);
        }
    }, [startDate, endDate]);

    const setDatePreset = (preset: 'today' | '7days' | 'month') => {
        const today = new Date();
        const end = today.toISOString().split('T')[0];
        let start;
        if(preset === 'today') {
            start = end;
        } else if (preset === '7days') {
            const pastDate = new Date();
            pastDate.setDate(today.getDate() - 7);
            start = pastDate.toISOString().split('T')[0];
        } else { // month
             const pastDate = new Date(today.getFullYear(), today.getMonth(), 1);
             start = pastDate.toISOString().split('T')[0];
        }
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-white">Report Generation</h1>
            <div className="glass-card p-8 rounded-2xl shadow-lg border-t-2 border-l-2 border-white/10">
                <div className="flex flex-wrap items-end gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="block w-full rounded-md bg-white/5 border-white/20 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 py-2 px-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="block w-full rounded-md bg-white/5 border-white/20 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 py-2 px-3" />
                    </div>
                    <div className="flex gap-2 pt-6">
                        <button onClick={() => setDatePreset('today')} className="py-2 px-3 border border-white/20 rounded-md text-sm bg-white/5 hover:bg-white/10">Today</button>
                        <button onClick={() => setDatePreset('7days')} className="py-2 px-3 border border-white/20 rounded-md text-sm bg-white/5 hover:bg-white/10">Last 7 Days</button>
                        <button onClick={() => setDatePreset('month')} className="py-2 px-3 border border-white/20 rounded-md text-sm bg-white/5 hover:bg-white/10">This Month</button>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-6">
                     <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="btn-gradient inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm disabled:opacity-50"
                     >
                        {isExporting ? 'Exporting...' : 'Export to Excel (.csv)'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Report;
