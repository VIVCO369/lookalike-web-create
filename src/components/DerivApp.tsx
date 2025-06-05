import React from 'react';
import DerivChartEnhanced from './DerivChartEnhanced';

interface DerivAppProps {
  appId?: string;
  apiToken?: string;
}

function DerivApp({ appId = "1089", apiToken }: DerivAppProps) {
  return (
    <div className="bg-gray-900 dark:bg-gray-900">
      <div className="bg-black text-white p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">
          Deriv Synthetic Chart Dashboard
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Real-time synthetic indices trading data
        </p>
      </div>
      <DerivChartEnhanced appId={appId} apiToken={apiToken} />
    </div>
  );
}

export default DerivApp;
