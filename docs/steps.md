# Step 4: Organizing Your Project Structure

### Recommended Folder Structure

Create this structure in your `src` folder:

```
src/
├── features/
│   ├── trading/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── market-data/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── portfolio/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── orders/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── auth/
│       ├── components/
│       ├── hooks/
│       └── services/
├── shared/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── charts/
│   ├── hooks/
│   ├── utils/
│   └── constants/
├── services/
│   ├── api/
│   ├── websocket/
│   └── storage/
├── store/
│   ├── slices/
│   └── index.js
├── styles/
│   ├── theme.js
│   ├── globalStyles.js
│   └── tokens.js
├── App.jsx
└── main.jsx
```


## **Phase 1: Core Infrastructure Setup**

Let's start with the essential building blocks:

### 1. **Design System & Theme Tokens**Perfect! I can see you already have a good start with theming and basic pages. Let me build on top of this foundation. I'll create the core infrastructure step by step.

## **Step 1: Install Dependencies**

First, create an installation script:

```shell script
npm install zustand @tanstack/react-query socket.io-client lightweight-charts axios react-hook-form date-fns immer
```


## **Step 2: Core Infrastructure Files**

Let me create the essential files for your trading platform:

### 1. **WebSocket Connection Manager**Let me check what files exist:Let me read the existing files to understand your current setup:Let me check what you already have in place:Perfect! I can see you already have a solid start with theme management and basic structure. Let me now build out the complete foundation systematically. I'll create all the necessary files for a production-ready trading platform.

## **Installation Commands**

First, run these commands to install all necessary dependencies:

```shell script
npm install zustand @tanstack/react-query socket.io-client lightweight-charts axios react-hook-form date-fns
```


```shell script
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```


---

## **Core Infrastructure Files**

### 1. **WebSocket Connection Manager**

```javascript
class WebSocketManager {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnecting = false;
    this.messageQueue = [];
    this.heartbeatInterval = null;
  }

  connect(url, options = {}) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    this.isConnecting = true;
    this.url = url;
    this.options = options;

    try {
      this.ws = new WebSocket(url);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.flushMessageQueue();
      this.notifySubscribers('connection', { status: 'connected' });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.notifySubscribers('error', { error });
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnecting = false;
      this.stopHeartbeat();
      this.notifySubscribers('connection', { status: 'disconnected' });
      
      if (!event.wasClean) {
        this.handleReconnect();
      }
    };
  }

  handleMessage(data) {
    const { type, payload } = data;
    
    if (type === 'pong') {
      return; // Heartbeat response
    }

    this.notifySubscribers(type, payload);
  }

  subscribe(channel, callback) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    
    this.subscribers.get(channel).add(callback);

    // Send subscription message to server
    this.send({
      type: 'subscribe',
      channel
    });

    // Return unsubscribe function
    return () => this.unsubscribe(channel, callback);
  }

  unsubscribe(channel, callback) {
    const channelSubscribers = this.subscribers.get(channel);
    if (channelSubscribers) {
      channelSubscribers.delete(callback);
      
      if (channelSubscribers.size === 0) {
        this.subscribers.delete(channel);
        // Send unsubscribe message to server
        this.send({
          type: 'unsubscribe',
          channel
        });
      }
    }
  }

  notifySubscribers(channel, data) {
    const channelSubscribers = this.subscribers.get(channel);
    if (channelSubscribers) {
      channelSubscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      // Queue messages if not connected
      this.messageQueue.push(data);
    }
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000); // 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.notifySubscribers('connection', { 
        status: 'failed', 
        message: 'Failed to reconnect after maximum attempts' 
      });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect(this.url, this.options);
    }, delay);
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.subscribers.clear();
    this.messageQueue = [];
  }

  getConnectionState() {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }
}

// Singleton instance
export const wsManager = new WebSocketManager();
export default wsManager;
```


### 2. **State Management with Zustand**

```javascript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Market Data Store
export const useMarketDataStore = create(
  devtools(
    (set, get) => ({
      prices: {},
      tickers: {},
      orderBooks: {},
      candles: {},
      
      updatePrice: (symbol, price) => 
        set((state) => ({
          prices: { ...state.prices, [symbol]: price }
        })),
      
      updateTicker: (symbol, ticker) =>
        set((state) => ({
          tickers: { ...state.tickers, [symbol]: ticker }
        })),
      
      updateOrderBook: (symbol, orderBook) =>
        set((state) => ({
          orderBooks: { ...state.orderBooks, [symbol]: orderBook }
        })),
      
      addCandle: (symbol, timeframe, candle) =>
        set((state) => {
          const key = `${symbol}_${timeframe}`;
          const existingCandles = state.candles[key] || [];
          return {
            candles: {
              ...state.candles,
              [key]: [...existingCandles, candle].slice(-1000) // Keep last 1000 candles
            }
          };
        }),
      
      getPrice: (symbol) => get().prices[symbol],
      getTicker: (symbol) => get().tickers[symbol],
      getOrderBook: (symbol) => get().orderBooks[symbol],
      getCandles: (symbol, timeframe) => get().candles[`${symbol}_${timeframe}`] || [],
    }),
    { name: 'market-data-store' }
  )
);

// Trading Store
export const useTradingStore = create(
  devtools(
    (set, get) => ({
      orders: [],
      positions: [],
      balance: 0,
      equity: 0,
      margin: 0,
      freeMargin: 0,
      marginLevel: 0,
      
      setBalance: (balance) => set({ balance }),
      
      setAccountInfo: (info) =>
        set({
          balance: info.balance,
          equity: info.equity,
          margin: info.margin,
          freeMargin: info.freeMargin,
          marginLevel: info.marginLevel,
        }),
      
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order]
        })),
      
      updateOrder: (orderId, updates) =>
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, ...updates } : order
          )
        })),
      
      removeOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.filter(order => order.id !== orderId)
        })),
      
      setOrders: (orders) => set({ orders }),
      
      addPosition: (position) =>
        set((state) => ({
          positions: [...state.positions, position]
        })),
      
      updatePosition: (positionId, updates) =>
        set((state) => ({
          positions: state.positions.map(position =>
            position.id === positionId ? { ...position, ...updates } : position
          )
        })),
      
      removePosition: (positionId) =>
        set((state) => ({
          positions: state.positions.filter(position => position.id !== positionId)
        })),
      
      setPositions: (positions) => set({ positions }),
      
      getPendingOrders: () => 
        get().orders.filter(order => order.status === 'pending'),
      
      getFilledOrders: () =>
        get().orders.filter(order => order.status === 'filled'),
      
      getTotalPnL: () =>
        get().positions.reduce((sum, pos) => sum + (pos.unrealizedPnL || 0), 0),
    }),
    { name: 'trading-store' }
  )
);

// UI Store
export const useUIStore = create(
  persist(
    devtools(
      (set) => ({
        activeSymbol: 'BTCUSD',
        activeTimeframe: '1h',
        chartType: 'candlestick',
        showOrderBook: true,
        showTrades: true,
        layout: 'default',
        notifications: [],
        
        setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),
        setActiveTimeframe: (timeframe) => set({ activeTimeframe: timeframe }),
        setChartType: (type) => set({ chartType: type }),
        toggleOrderBook: () => set((state) => ({ showOrderBook: !state.showOrderBook })),
        toggleTrades: () => set((state) => ({ showTrades: !state.showTrades })),
        setLayout: (layout) => set({ layout }),
        
        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              { id: Date.now(), timestamp: Date.now(), ...notification }
            ]
          })),
        
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          })),
        
        clearNotifications: () => set({ notifications: [] }),
      }),
      { name: 'ui-store' }
    ),
    {
      name: 'bhc-markets-ui',
      partialize: (state) => ({
        activeTimeframe: state.activeTimeframe,
        chartType: state.chartType,
        layout: state.layout,
        showOrderBook: state.showOrderBook,
        showTrades: state.showTrades,
      })
    }
  )
);

// Connection Store
export const useConnectionStore = create(
  devtools(
    (set) => ({
      status: 'disconnected',
      latency: 0,
      lastUpdate: null,
      
      setStatus: (status) => set({ status, lastUpdate: Date.now() }),
      setLatency: (latency) => set({ latency }),
      
      isConnected: () => set((state) => state.status === 'connected'),
    }),
    { name: 'connection-store' }
  )
);
```


### 3. **API Client**

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class APIClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        
        return Promise.reject({
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    );
  }

  // Market Data APIs
  async getMarkets() {
    return this.client.get('/markets');
  }

  async getMarketInfo(symbol) {
    return this.client.get(`/markets/${symbol}`);
  }

  async getCandles(symbol, timeframe, limit = 100) {
    return this.client.get(`/markets/${symbol}/candles`, {
      params: { timeframe, limit }
    });
  }

  async getTicker(symbol) {
    return this.client.get(`/markets/${symbol}/ticker`);
  }

  async getOrderBook(symbol, depth = 20) {
    return this.client.get(`/markets/${symbol}/orderbook`, {
      params: { depth }
    });
  }

  // Trading APIs
  async placeOrder(orderData) {
    return this.client.post('/orders', orderData);
  }

  async cancelOrder(orderId) {
    return this.client.delete(`/orders/${orderId}`);
  }

  async modifyOrder(orderId, updates) {
    return this.client.patch(`/orders/${orderId}`, updates);
  }

  async getOrders(status = 'all') {
    return this.client.get('/orders', { params: { status } });
  }

  async getOrderHistory(params = {}) {
    return this.client.get('/orders/history', { params });
  }

  // Portfolio APIs
  async getAccountInfo() {
    return this.client.get('/account');
  }

  async getPositions() {
    return this.client.get('/positions');
  }

  async closePosition(positionId) {
    return this.client.post(`/positions/${positionId}/close`);
  }

  async getTransactions(params = {}) {
    return this.client.get('/transactions', { params });
  }

  // Auth APIs
  async login(credentials) {
    const response = await this.client.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  }

  async logout() {
    localStorage.removeItem('authToken');
    return this.client.post('/auth/logout');
  }

  async register(userData) {
    return this.client.post('/auth/register', userData);
  }

  async verifyToken() {
    return this.client.get('/auth/verify');
  }
}

export const apiClient = new APIClient();
export default apiClient;
```


### 4. **Design System Tokens**

```javascript
export const tokens = {
  colors: {
    // Primary palette
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
    
    // Success/Profit (Green)
    success: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4caf50',
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32',
      900: '#1b5e20',
    },
    
    // Error/Loss (Red)
    error: {
      50: '#ffebee',
      100: '#ffcdd2',
      200: '#ef9a9a',
      300: '#e57373',
      400: '#ef5350',
      500: '#f44336',
      600: '#e53935',
      700: '#d32f2f',
      800: '#c62828',
      900: '#b71c1c',
    },
    
    // Warning
    warning: {
      50: '#fff3e0',
      100: '#ffe0b2',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa726',
      500: '#ff9800',
      600: '#fb8c00',
      700: '#f57c00',
      800: '#ef6c00',
      900: '#e65100',
    },
    
    // Info
    info: {
      50: '#e1f5fe',
      100: '#b3e5fc',
      200: '#81d4fa',
      300: '#4fc3f7',
      400: '#29b6f6',
      500: '#03a9f4',
      600: '#039be5',
      700: '#0288d1',
      800: '#0277bd',
      900: '#01579b',
    },
    
    // Neutrals
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    
    // Trading specific
    buy: '#10b981',
    sell: '#ef4444',
    long: '#22c55e',
    short: '#f43f5e',
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export default tokens;
```


### 5. **Enhanced Theme Configuration**

```javascript
import { tokens } from './tokens';

export const lightTheme = {
  name: 'light',
  colors: {
    // Background
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#f1f3f5',
      elevated: '#ffffff',
    },
    
    // Text
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      inverse: '#ffffff',
    },
    
    // Border
    border: {
      primary: '#e5e7eb',
      secondary: '#d1d5db',
      focus: tokens.colors.primary[500],
    },
    
    // Chart
    chart: {
      background: '#ffffff',
      grid: '#f3f4f6',
      text: '#6b7280',
      crosshair: '#9ca3af',
      buy: tokens.colors.success[500],
      sell: tokens.colors.error[500],
    },
    
    // Trading
    trading: {
      buy: tokens.colors.buy,
      sell: tokens.colors.sell,
      long: tokens.colors.long,
      short: tokens.colors.short,
      profit: tokens.colors.success[600],
      loss: tokens.colors.error[600],
    },
    
    // Status
    status: {
      success: tokens.colors.success[500],
      error: tokens.colors.error[500],
      warning: tokens.colors.warning[500],
      info: tokens.colors.info[500],
    },
    
    ...tokens.colors,
  },
  
  ...tokens,
};

export const darkTheme = {
  name: 'dark',
  colors: {
    // Background
    background: {
      primary: '#0f1419',
      secondary: '#1a1f2e',
      tertiary: '#252d3d',
      elevated: '#1f2937',
    },
    
    // Text
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af',
      inverse: '#1a1a1a',
    },
    
    // Border
    border: {
      primary: '#374151',
      secondary: '#4b5563',
      focus: tokens.colors.primary[400],
    },
    
    // Chart
    chart: {
      background: '#1a1f2e',
      grid: '#252d3d',
      text: '#9ca3af',
      crosshair: '#6b7280',
      buy: tokens.colors.success[400],
      sell: tokens.colors.error[400],
    },
    
    // Trading
    trading: {
      buy: '#10b981',
      sell: '#ef4444',
      long: '#22c55e',
      short: '#f43f5e',
      profit: tokens.colors.success[400],
      loss: tokens.colors.error[400],
    },
    
    // Status
    status: {
      success: tokens.colors.success[400],
      error: tokens.colors.error[400],
      warning: tokens.colors.warning[400],
      info: tokens.colors.info[400],
    },
    
    ...tokens.colors,
  },
  
  ...tokens,
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;
```


### 6. **Constants & Configuration**

```javascript
export const ORDER_TYPES = {
  MARKET: 'market',
  LIMIT: 'limit',
  STOP_LOSS: 'stop_loss',
  TAKE_PROFIT: 'take_profit',
  STOP_LIMIT: 'stop_limit',
};

export const ORDER_SIDES = {
  BUY: 'buy',
  SELL: 'sell',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  FILLED: 'filled',
  PARTIALLY_FILLED: 'partially_filled',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

export const TIMEFRAMES = {
  '1m': { label: '1 Minute', seconds: 60 },
  '5m': { label: '5 Minutes', seconds: 300 },
  '15m': { label: '15 Minutes', seconds: 900 },
  '30m': { label: '30 Minutes', seconds: 1800 },
  '1h': { label: '1 Hour', seconds: 3600 },
  '4h': { label: '4 Hours', seconds: 14400 },
  '1d': { label: '1 Day', seconds: 86400 },
  '1w': { label: '1 Week', seconds: 604800 },
};

export const CHART_TYPES = {
  CANDLESTICK: 'candlestick',
  LINE: 'line',
  AREA: 'area',
  BAR: 'bar',
};

export const POSITION_SIDES = {
  LONG: 'long',
  SHORT: 'short',
};

export const MARKET_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  PRE_MARKET: 'pre_market',
  POST_MARKET: 'post_market',
};

export const DEFAULT_SYMBOLS = [
  { symbol: 'BTCUSD', name: 'Bitcoin', category: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum', category: 'crypto' },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stocks' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'stocks' },
  { symbol: 'EURUSD', name: 'Euro/US Dollar', category: 'forex' },
  { symbol: 'GBPUSD', name: 'British Pound/US Dollar', category: 'forex' },
  { symbol: 'XAUUSD', name: 'Gold', category: 'commodities' },
  { symbol: 'OILUSD', name: 'Crude Oil', category: 'commodities' },
];
```


```javascript
export const APP_CONFIG = {
  name: 'BHC Markets',
  version: '1.0.0',
  apiVersion: 'v1',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MARKETS: '/markets',
  TRADING: '/trading',
  PORTFOLIO: '/portfolio',
  ORDERS: '/orders',
  HISTORY: '/history',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
  LAYOUT: 'layout',
  FAVORITES: 'favorites',
  WATCHLIST: 'watchlist',
};
```


### 7. **Utility Functions**

```javascript
export const formatCurrency = (value, decimals = 2, currency = 'USD') => {
  if (value === null || value === undefined) return '--';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '--';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined) return '--';
  
  const formatted = (value * 100).toFixed(decimals);
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatted}%`;
};

export const formatVolume = (value) => {
  if (value === null || value === undefined) return '--';
  
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
};

export const formatDate = (date, format = 'short') => {
  if (!date) return '--';
  
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  if (format === 'time') {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  
  return d.toLocaleString('en-US');
};

export const formatRelativeTime = (date) => {
  if (!date) return '--';
  
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
};
```


```javascript
export const calculatePnL = (entryPrice, currentPrice, quantity, side) => {
  const priceDiff = side === 'long' 
    ? currentPrice - entryPrice 
    : entryPrice - currentPrice;
  
  return priceDiff * quantity;
};

export const calculatePnLPercent = (entryPrice, currentPrice, side) => {
  const priceDiff = side === 'long'
    ? currentPrice - entryPrice
    : entryPrice - currentPrice;
  
  return (priceDiff / entryPrice) * 100;
};

export const calculateRequiredMargin = (price, quantity, leverage = 1) => {
  return (price * quantity) / leverage;
};

export const calculatePositionSize = (accountBalance, riskPercent, entryPrice, stopLoss) => {
  const riskAmount = accountBalance * (riskPercent / 100);
  const priceRisk = Math.abs(entryPrice - stopLoss);
  return riskAmount / priceRisk;
};

export const calculateLiquidationPrice = (entryPrice, leverage, side) => {
  if (side === 'long') {
    return entryPrice * (1 - (1 / leverage) * 0.9); // 90% margin
  } else {
    return entryPrice * (1 + (1 / leverage) * 0.9);
  }
};

export const calculateRiskRewardRatio = (entryPrice, stopLoss, takeProfit) => {
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  return reward / risk;
};
```


### 8. **Update package.json with test script**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```


---

## **Next Steps**

I've created the complete foundation. Now we need to:

1. **Create the visual components** (charts, order forms, etc.)
2. **Implement the trading interface**
3. **Build the market data components**
