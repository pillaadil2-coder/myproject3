import React, { useEffect, useRef } from 'react';

const SYMBOL_MAP = {
  'EUR/USD': 'FX:EURUSD',
  'GBP/USD': 'FX:GBPUSD',
  'USD/JPY': 'FX:USDJPY',
  'AUD/USD': 'FX:AUDUSD',
  'USD/CAD': 'FX:USDCAD',
  'EUR/GBP': 'FX:EURGBP',
  'XAU/USD': 'OANDA:XAUUSD',
  'XAG/USD': 'OANDA:XAGUSD',
  'USOIL': 'TVC:USOIL',
  'BTC/USDT': 'BINANCE:BTCUSDT',
  'ETH/USDT': 'BINANCE:ETHUSDT',
  'SOL/USDT': 'BINANCE:SOLUSDT',
  'XRP/USDT': 'BINANCE:XRPUSDT',
  'US30': 'FOREXCOM:DJI',
  'NAS100': 'FOREXCOM:NAS100',
  'SPX500': 'FOREXCOM:SPX500'
};

export default function TradingViewWidget({ symbol = 'EUR/USD' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const containerId = 'tradingview_chart_container';
    if (containerRef.current) {
      containerRef.current.innerHTML = `<div id="${containerId}" style="height: 100%; width: 100%;"></div>`;
    }

    const tvSymbol = SYMBOL_MAP[symbol] || 'FX:EURUSD';

    function initWidget() {
      if (typeof window.TradingView !== 'undefined' && document.getElementById(containerId)) {
        new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1', // Candlestick
          locale: 'en',
          toolbar_bg: '#ffffff',
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: containerId,
          hide_side_toolbar: false,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies'
          ],
          overrides: {
            "paneProperties.background": "#ffffff",
            "paneProperties.vertGridProperties.color": "#f1f5f9",
            "paneProperties.horzGridProperties.color": "#f1f5f9",
            "symbolWatermarkProperties.transparency": 95,
            "scalesProperties.textColor": "#475569",
            "scalesProperties.lineColor": "#e2e8f0",
            "mainSeriesProperties.candleStyle.upColor": "#10b981",
            "mainSeriesProperties.candleStyle.downColor": "#ef4444",
            "mainSeriesProperties.candleStyle.drawWick": true,
            "mainSeriesProperties.candleStyle.drawBorder": true,
            "mainSeriesProperties.candleStyle.borderColor": "#10b981",
            "mainSeriesProperties.candleStyle.borderUpColor": "#10b981",
            "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
            "mainSeriesProperties.candleStyle.wickUpColor": "#10b981",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444"
          }
        });
      }
    }

    if (window.TradingView) {
      initWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }
  }, [symbol]);

  return (
    <div className="w-full h-full relative min-h-[380px] bg-white border-b border-slate-200" ref={containerRef}>
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Loading TradingView Chart for {symbol}...
      </div>
    </div>
  );
}
