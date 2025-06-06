import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData, CandlestickData } from 'lightweight-charts';

const indices = [
  'R_100',
  'R_75',
  'R_50',
  'R_25',
  'R_10',
  'Volatility 10 (1s)',
  'Volatility 25 (1s)',
  'Volatility 50 (1s)',
  'Volatility 75 (1s)',
  'Volatility 100 (1s)',
];

const granularities = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
};

interface DerivChartEnhancedProps {
  appId?: string;
  apiToken?: string;
}

const DerivChartEnhanced: React.FC<DerivChartEnhancedProps> = ({ appId = '1089', apiToken }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | ISeriesApi<"Candlestick"> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);

  const [symbol, setSymbol] = useState('R_100');
  const [chartType, setChartType] = useState('line'); // 'line' or 'candlestick'
  const [granularity, setGranularity] = useState(60);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [localApiToken, setLocalApiToken] = useState(apiToken || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validateToken = (token: string): boolean => {
    // Basic token validation - Deriv tokens are typically 15+ characters alphanumeric
    if (!token || token.trim().length === 0) return false;
    const trimmedToken = token.trim();
    return trimmedToken.length >= 10 && /^[a-zA-Z0-9]+$/.test(trimmedToken);
  };

  const requestMarketData = (ws: WebSocket) => {
    setTimeout(() => {
      if (chartType === 'line') {
        console.log('Requesting ticks for:', symbol);
        ws.send(JSON.stringify({
          ticks: symbol,
          subscribe: 1,
          req_id: 2
        }));
      } else {
        console.log('Requesting candles for:', symbol);
        ws.send(JSON.stringify({
          ticks_history: symbol,
          style: 'candles',
          granularity,
          count: 100,
          end: 'latest',
          req_id: 3
        }));
      }
    }, 200); // Small delay to ensure connection is fully established
  };

  // Helper function to set up WebSocket event handlers
  const setupWebSocketHandlers = (ws: WebSocket, chart: IChartApi, series: ISeriesApi<"Line"> | ISeriesApi<"Candlestick">, timeoutRef?: NodeJS.Timeout) => {
    ws.onopen = () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      console.log('✅ WebSocket connected to Deriv API');
      setConnectionStatus('connected');
      setError(null);

      // If we have an API token, authorize first
      if (localApiToken && localApiToken.trim() && validateToken(localApiToken.trim())) {
        console.log('🔐 Authorizing with API token...');
        ws.send(JSON.stringify({
          authorize: localApiToken.trim(),
          req_id: 1
        }));
      } else {
        // Try to access public data without authorization
        console.log('🌐 Attempting to access public data without token...');
        requestMarketData(ws);
      }
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        console.log('WebSocket data received:', data);

        // Handle authorization response
        if (data.authorize) {
          console.log('✅ Authorization successful:', data.authorize);
          setError(null);
          setIsAuthenticated(true);
          // Now request market data after successful authorization
          requestMarketData(ws);
          return;
        }

        // Handle error responses
        if (data.error) {
          console.error('❌ API Error:', data.error);
          let errorMessage = data.error.message || 'Unknown error';

          // Provide specific error messages for common issues
          if (data.error.code === 'InvalidToken') {
            errorMessage = 'Invalid API token. Please check your token and try again.';
          } else if (data.error.code === 'AuthorizationRequired') {
            errorMessage = 'Authorization required. Please provide a valid API token.';
          }

          setError(`API Error: ${errorMessage}`);
          setConnectionStatus('error');
          return;
        }

        // Handle tick data for line charts
        if (data.tick && chartType === 'line') {
          console.log('📈 Updating tick data:', data.tick);
          const tickData: LineData = {
            time: data.tick.epoch,
            value: parseFloat(data.tick.quote)
          };
          (series as ISeriesApi<"Line">).update(tickData);
        }

        // Handle historical candle data for candlestick charts
        if (data.candles && chartType === 'candlestick') {
          console.log('📊 Setting candle data:', data.candles.length, 'candles');
          const candles: CandlestickData[] = data.candles.map((c: any) => ({
            time: c.epoch,
            open: parseFloat(c.open),
            high: parseFloat(c.high),
            low: parseFloat(c.low),
            close: parseFloat(c.close),
          }));
          (series as ISeriesApi<"Candlestick">).setData(candles);
        }

        // Handle subscription confirmation
        if (data.subscription) {
          console.log('✅ Subscription confirmed for:', data.subscription.id);
        }

        // Handle ping/pong to keep connection alive
        if (data.ping) {
          ws.send(JSON.stringify({ pong: data.ping }));
        }

      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        setError('Error parsing data from server');
      }
    };

    ws.onerror = (error) => {
      if (timeoutRef) clearTimeout(timeoutRef);
      console.error('❌ WebSocket error:', error);
      setConnectionStatus('error');

      let errorMessage = 'Failed to connect to Deriv API. Please check your internet connection.';

      // Provide more specific error messages
      if (navigator.onLine === false) {
        errorMessage = 'No internet connection detected. Please check your network.';
      } else if (!localApiToken || localApiToken.trim().length === 0) {
        errorMessage = 'API token is required for authentication.';
      } else if (!validateToken(localApiToken.trim())) {
        errorMessage = 'Invalid API token format. Please check your token.';
      }

      setError(errorMessage);
      setIsAuthenticated(false);
    };

    ws.onclose = () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
      setIsAuthenticated(false);
    };
  };

  const setupWebSocket = (chart: IChartApi, series: ISeriesApi<"Line"> | ISeriesApi<"Candlestick">) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      setConnectionStatus('connecting');
      setError(null);
      setIsAuthenticated(false);

      // Try multiple WebSocket endpoints for better compatibility
      const wsEndpoints = [
        `wss://ws.derivws.com/websockets/v3?app_id=${appId}`,
        `wss://ws.binaryws.com/websockets/v3?app_id=${appId}`,
        `wss://frontend.derivws.com/websockets/v3?app_id=${appId}`
      ];

      const wsUrl = wsEndpoints[0]; // Start with the primary endpoint
      console.log('🔌 Connecting to Deriv WebSocket:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Add connection timeout with retry logic
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.log('⏰ Connection timeout, closing...');
          ws.close();

          // Try alternative endpoints if available
          const wsEndpoints = [
            `wss://ws.derivws.com/websockets/v3?app_id=${appId}`,
            `wss://ws.binaryws.com/websockets/v3?app_id=${appId}`,
            `wss://frontend.derivws.com/websockets/v3?app_id=${appId}`
          ];

          if (wsUrl !== wsEndpoints[1] && wsEndpoints.length > 1) {
            console.log('🔄 Trying alternative endpoint...');
            setTimeout(() => {
              const altWs = new WebSocket(wsEndpoints[1]);
              wsRef.current = altWs;
              // Set up the same handlers for the alternative connection
              setupWebSocketHandlers(altWs, chart, series);
            }, 1000);
          } else {
            setError('Connection timeout. Please check your network and try again.');
            setConnectionStatus('error');
          }
        }
      }, 10000); // 10 second timeout

      // Set up WebSocket event handlers
      setupWebSocketHandlers(ws, chart, series, connectionTimeout);
    } catch (error) {
      console.error('❌ Error setting up WebSocket:', error);
      setError(`Failed to create WebSocket connection: ${error}`);
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    try {
      // Clean up previous chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
      }

      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#111' },
          textColor: '#fff'
        },
        grid: {
          vertLines: { color: '#333' },
          horzLines: { color: '#333' }
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: chartType === 'line'
        },
      });

      chartInstanceRef.current = chart;

      let series;
      if (chartType === 'line') {
        series = chart.addLineSeries({
          color: '#00f57f',
          lineWidth: 2
        });
      } else {
        series = chart.addCandlestickSeries({
          upColor: '#0f0',
          downColor: '#f00',
          borderVisible: false,
          wickUpColor: '#0f0',
          wickDownColor: '#f00',
        });
      }

      seriesRef.current = series;

      // Add some sample data to test chart rendering
      if (chartType === 'line') {
        const sampleData: LineData[] = [
          { time: Math.floor(Date.now() / 1000) - 300, value: 100 },
          { time: Math.floor(Date.now() / 1000) - 240, value: 102 },
          { time: Math.floor(Date.now() / 1000) - 180, value: 98 },
          { time: Math.floor(Date.now() / 1000) - 120, value: 105 },
          { time: Math.floor(Date.now() / 1000) - 60, value: 103 },
          { time: Math.floor(Date.now() / 1000), value: 101 },
        ];
        (series as ISeriesApi<"Line">).setData(sampleData);
      } else {
        const sampleCandles: CandlestickData[] = [
          { time: Math.floor(Date.now() / 1000) - 300, open: 100, high: 105, low: 98, close: 102 },
          { time: Math.floor(Date.now() / 1000) - 240, open: 102, high: 108, low: 100, close: 106 },
          { time: Math.floor(Date.now() / 1000) - 180, open: 106, high: 110, low: 104, close: 108 },
          { time: Math.floor(Date.now() / 1000) - 120, open: 108, high: 112, low: 106, close: 110 },
          { time: Math.floor(Date.now() / 1000) - 60, open: 110, high: 115, low: 108, close: 112 },
          { time: Math.floor(Date.now() / 1000), open: 112, high: 118, low: 110, close: 115 },
        ];
        (series as ISeriesApi<"Candlestick">).setData(sampleCandles);
      }

      setupWebSocket(chart, series);

      // Handle resize
      const handleResize = () => {
        if (chartRef.current && chart) {
          chart.applyOptions({
            width: chartRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstanceRef.current) {
          chartInstanceRef.current.remove();
        }
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, [symbol, chartType, granularity, appId, localApiToken]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  const getStatusDotColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-400';
      case 'connecting': return 'bg-blue-400 animate-pulse';
      case 'error': return 'bg-red-400';
      default: return 'bg-yellow-400';
    }
  };

  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-4">
      {/* Connection Status */}
      <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusDotColor()}`}></div>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <span className="text-gray-400 text-xs">
              • App ID: {appId} • Symbol: {symbol}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (chartInstanceRef.current && seriesRef.current) {
                  setupWebSocket(chartInstanceRef.current, seriesRef.current);
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            >
              Reconnect
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded">
            <span className="text-red-400 text-sm">⚠️ {error}</span>
          </div>
        )}
      </div>

      {/* API Token Input */}
      <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold text-white text-sm">Deriv API Token:</label>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <span className="text-green-400 text-xs flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Authenticated
              </span>
            )}
            {localApiToken && !validateToken(localApiToken) && (
              <span className="text-red-400 text-xs">Invalid token format</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="password"
            value={localApiToken}
            onChange={(e) => setLocalApiToken(e.target.value)}
            placeholder="Enter your Deriv API token (e.g., aBcD1234...)"
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm placeholder-gray-400"
          />
          <button
            onClick={() => {
              if (chartInstanceRef.current && seriesRef.current) {
                setIsAuthenticated(false);
                setupWebSocket(chartInstanceRef.current, seriesRef.current);
              }
            }}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
          >
            Test Token
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-1">
          Get your API token from{' '}
          <a href="https://app.deriv.com/account/api-token" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Deriv API Token page
          </a>
          {' '}• Scope: Read, Trade (optional)
        </p>
      </div>

      {/* Chart Controls */}
      <div className="mb-4 flex flex-wrap gap-4 items-center text-white">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Index:</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm"
          >
            {indices.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold">Chart Type:</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm"
          >
            <option value="line">Line</option>
            <option value="candlestick">Candlestick</option>
          </select>
        </div>

        {chartType === 'candlestick' && (
          <div className="flex items-center gap-2">
            <label className="font-semibold">Granularity:</label>
            <select
              value={granularity}
              onChange={(e) => setGranularity(parseInt(e.target.value))}
              className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm"
            >
              {Object.entries(granularities).map(([label, value]) => (
                <option key={label} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div
        ref={chartRef}
        className="w-full h-96 bg-gray-800 rounded border border-gray-600"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default DerivChartEnhanced;
