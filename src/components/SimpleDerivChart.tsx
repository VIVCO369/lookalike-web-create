import React, { useEffect, useRef, useState } from 'react';

const SimpleDerivChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 p-4">
        <div className="bg-black text-white p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">
            Deriv Synthetic Chart Dashboard
          </h2>
        </div>
        <div className="p-4 text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 p-4">
        <div className="bg-black text-white p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">
            Deriv Synthetic Chart Dashboard
          </h2>
        </div>
        <div className="p-4 text-red-400 text-center">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
      <div className="bg-black text-white p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">
          Deriv Synthetic Chart Dashboard
        </h2>
      </div>
      <div className="p-4">
        <div className="mb-4 flex flex-wrap gap-4 items-center text-white">
          <div className="flex items-center gap-2">
            <label className="font-semibold">Index:</label>
            <select className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm">
              <option value="R_100">R_100</option>
              <option value="R_75">R_75</option>
              <option value="R_50">R_50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Chart Type:</label>
            <select className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm">
              <option value="line">Line</option>
              <option value="candlestick">Candlestick</option>
            </select>
          </div>
        </div>

        <div className="w-full h-96 bg-gray-800 rounded border border-gray-600 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-lg">Chart will appear here</p>
            <p className="text-sm text-gray-400 mt-2">
              Real-time trading data from Deriv API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDerivChart;
