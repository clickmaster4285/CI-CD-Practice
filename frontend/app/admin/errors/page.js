'use client';

import { useEffect, useState } from 'react';

export default function ErrorDashboard() {
   const [errors, setErrors] = useState([]);
   const [filter, setFilter] = useState('all');

   useEffect(() => {
      // Fetch errors from localStorage
      const stored = localStorage.getItem('production-errors');
      if (stored) {
         setErrors(JSON.parse(stored));
      }

      // Also fetch from server
      fetch('/api/monitoring/errors')
         .then(res => res.json())
         .then(data => setErrors(prev => [...prev, ...data]));
   }, []);

   const filteredErrors = errors.filter(error =>
      filter === 'all' ? true : error.type === filter
   );

   return (
      <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">Production Error Dashboard</h1>

         <div className="mb-4">
            <select
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="border p-2 rounded"
            >
               <option value="all">All Errors</option>
               <option value="uncaught-error">Uncaught Errors</option>
               <option value="unhandled-rejection">Promise Rejections</option>
               <option value="memory-warning">Memory Warnings</option>
               <option value="rapid-clicks">Rapid Clicks</option>
            </select>
         </div>

         <div className="space-y-4">
            {filteredErrors.map((error, index) => (
               <div key={index} className="border p-4 rounded bg-white shadow">
                  <div className="flex justify-between">
                     <span className="font-semibold text-red-600">{error.type}</span>
                     <span className="text-gray-500">{new Date(error.timestamp).toLocaleString()}</span>
                  </div>
                  <pre className="mt-2 text-sm bg-gray-50 p-2 rounded overflow-auto">
                     {JSON.stringify(error, null, 2)}
                  </pre>
               </div>
            ))}
         </div>
      </div>
   );
}