import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { tradeAPI, marketAPI } from '../services/api';
import { useAuth } from './AuthContext';

const TradingContext = createContext(null);

export const TradingProvider = ({ children }) => {
  const { user, token, setMetrics, refreshMetrics } = useAuth();
  
  const [socket, setSocket] = useState(null);
  const [prices, setPrices] = useState({}); // symbol -> quote
  const [activeSymbol, setActiveSymbol] = useState('EUR/USD');
  const [openTrades, setOpenTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loadingTrades, setLoadingTrades] = useState(false);

  // Load initial instruments
  useEffect(() => {
    marketAPI.getInstruments().then((res) => {
      if (res.data.success) {
        const map = {};
        res.data.instruments.forEach(inst => {
          map[inst.symbol] = inst;
        });
        setPrices(map);
      }
    }).catch(err => console.error('Failed to load initial instruments:', err));
  }, []);

  // Connect Socket.io
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || (window.location.port === '5173' ? 'http://localhost:5000' : window.location.origin);
    const s = io(socketUrl);
    setSocket(s);

    s.on('connect', () => {
      console.log('Connected to Trading Socket.io server');
      if (user && user.id) {
        s.emit('join_user', user.id);
      }
    });

    s.on('price_update', (updatedList) => {
      setPrices((prev) => {
        const next = { ...prev };
        for (const item of updatedList) {
          if (next[item.symbol]) {
            next[item.symbol] = {
              ...next[item.symbol],
              bid: item.bid,
              ask: item.ask,
              spread: item.spread,
              high: item.high,
              low: item.low,
              change24h: item.change24h
            };
          } else {
            next[item.symbol] = item;
          }
        }
        return next;
      });
    });

    s.on('trade_closed', (data) => {
      setNotification({
        type: data.pnl >= 0 ? 'success' : 'warning',
        message: `Trade #${data.tradeId} Closed: ${data.reason} (PnL: $${data.pnl})`
      });
      refreshTrades();
      refreshMetrics();
    });

    return () => {
      s.disconnect();
    };
  }, [user?.id]);

  // Load trades when token changes
  const refreshTrades = async () => {
    if (!token) return;
    setLoadingTrades(true);
    try {
      const [openRes, histRes] = await Promise.all([
        tradeAPI.getOpenTrades(),
        tradeAPI.getTradeHistory()
      ]);
      if (openRes.data.success) setOpenTrades(openRes.data.trades);
      if (histRes.data.success) setTradeHistory(histRes.data.trades);
    } catch (err) {
      console.error('Failed to fetch trades:', err);
    } finally {
      setLoadingTrades(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshTrades();
    } else {
      setOpenTrades([]);
      setTradeHistory([]);
    }
  }, [token]);

  // Recalculate floating PnL on local open trades when prices update
  useEffect(() => {
    if (openTrades.length === 0 || Object.keys(prices).length === 0) return;

    setOpenTrades((prevTrades) => {
      let changed = false;
      const updated = prevTrades.map((trade) => {
        const quote = prices[trade.symbol];
        if (!quote) return trade;

        const currentPrice = trade.type === 'BUY' ? quote.bid : quote.ask;
        const contractSize = quote.contract_size || 100000;
        let pnl = 0;
        if (trade.type === 'BUY') {
          pnl = (quote.bid - trade.open_price) * trade.lot_size * contractSize;
        } else {
          pnl = (trade.open_price - quote.ask) * trade.lot_size * contractSize;
        }
        pnl = Number(pnl.toFixed(2));

        if (trade.pnl !== pnl || trade.current_price !== currentPrice) {
          changed = true;
          return { ...trade, current_price: currentPrice, pnl };
        }
        return trade;
      });

      return changed ? updated : prevTrades;
    });
  }, [prices]);

  const placeOrder = async ({ type, lotSize, sl, tp }) => {
    try {
      const res = await tradeAPI.placeOrder({
        symbol: activeSymbol,
        type,
        lotSize,
        sl,
        tp
      });
      if (res.data.success) {
        setNotification({
          type: 'success',
          message: `${type} order executed for ${lotSize} lot ${activeSymbol}!`
        });
        refreshTrades();
        if (res.data.metrics) setMetrics(res.data.metrics);
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Order failed';
      setNotification({ type: 'error', message: msg });
      throw new Error(msg);
    }
  };

  const closeTrade = async (tradeId) => {
    try {
      const res = await tradeAPI.closeOrder(tradeId);
      if (res.data.success) {
        setNotification({
          type: 'success',
          message: `Position #${tradeId} closed with PnL: $${res.data.result.realizedPnl}`
        });
        refreshTrades();
        if (res.data.metrics) setMetrics(res.data.metrics);
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Close failed';
      setNotification({ type: 'error', message: msg });
      throw new Error(msg);
    }
  };

  return (
    <TradingContext.Provider value={{
      prices,
      activeSymbol,
      setActiveSymbol,
      activeQuote: prices[activeSymbol] || null,
      openTrades,
      tradeHistory,
      loadingTrades,
      refreshTrades,
      placeOrder,
      closeTrade,
      notification,
      setNotification
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => useContext(TradingContext);
