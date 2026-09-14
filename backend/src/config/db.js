const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for high performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDb() {
  // 1. Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user', -- 'user' or 'admin'
      balance REAL DEFAULT 10000.0,
      leverage INTEGER DEFAULT 100,
      kyc_status TEXT DEFAULT 'unverified', -- 'unverified', 'pending', 'approved', 'rejected'
      kyc_doc_type TEXT,
      kyc_doc_number TEXT,
      kyc_doc_file TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Trades table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      symbol TEXT NOT NULL,
      type TEXT NOT NULL, -- 'BUY' or 'SELL'
      lot_size REAL NOT NULL,
      open_price REAL NOT NULL,
      close_price REAL,
      current_price REAL NOT NULL,
      sl REAL,
      tp REAL,
      pnl REAL DEFAULT 0.0,
      margin REAL NOT NULL,
      status TEXT DEFAULT 'OPEN', -- 'OPEN', 'CLOSED'
      open_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      close_time DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // 3. Transactions table (Deposits / Withdrawals)
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL, -- 'DEPOSIT' or 'WITHDRAWAL'
      amount REAL NOT NULL,
      method TEXT NOT NULL, -- 'USDT_TRC20', 'USDT_ERC20', 'BANK_TRANSFER', 'UPI'
      status TEXT DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
      tx_hash TEXT,
      proof_file TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // 4. Symbols / Instruments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS symbols (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL, -- 'forex', 'crypto', 'commodities', 'indices'
      base_price REAL NOT NULL,
      spread REAL NOT NULL, -- in price units
      pip_size REAL NOT NULL,
      contract_size REAL NOT NULL,
      digits INTEGER DEFAULT 5
    );
  `);

  // Seed default symbols if empty
  const symbolCount = db.prepare('SELECT COUNT(*) as count FROM symbols').get().count;
  if (symbolCount === 0) {
    const insertSymbol = db.prepare(`
      INSERT INTO symbols (symbol, name, category, base_price, spread, pip_size, contract_size, digits)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const defaultSymbols = [
      // Forex
      ['EUR/USD', 'Euro / US Dollar', 'forex', 1.0854, 0.00015, 0.0001, 100000, 5],
      ['GBP/USD', 'British Pound / US Dollar', 'forex', 1.2980, 0.00020, 0.0001, 100000, 5],
      ['USD/JPY', 'US Dollar / Japanese Yen', 'forex', 152.45, 0.020, 0.01, 100000, 3],
      ['AUD/USD', 'Australian Dollar / US Dollar', 'forex', 0.6580, 0.00018, 0.0001, 100000, 5],
      ['USD/CAD', 'US Dollar / Canadian Dollar', 'forex', 1.3890, 0.00020, 0.0001, 100000, 5],
      ['EUR/GBP', 'Euro / British Pound', 'forex', 0.8360, 0.00018, 0.0001, 100000, 5],

      // Commodities
      ['XAU/USD', 'Gold / US Dollar', 'commodities', 2650.50, 0.35, 0.01, 100, 2],
      ['XAG/USD', 'Silver / US Dollar', 'commodities', 31.80, 0.03, 0.01, 5000, 3],
      ['USOIL', 'WTI Crude Oil', 'commodities', 72.40, 0.05, 0.01, 1000, 2],

      // Crypto
      ['BTC/USDT', 'Bitcoin / Tether', 'crypto', 67450.00, 12.00, 0.1, 1, 2],
      ['ETH/USDT', 'Ethereum / Tether', 'crypto', 2520.00, 1.20, 0.01, 1, 2],
      ['SOL/USDT', 'Solana / Tether', 'crypto', 178.50, 0.15, 0.01, 1, 2],
      ['XRP/USDT', 'Ripple / Tether', 'crypto', 0.5420, 0.0008, 0.0001, 1, 4],

      // Indices
      ['US30', 'Dow Jones 30', 'indices', 42800.00, 3.0, 1.0, 1, 1],
      ['NAS100', 'Nasdaq 100', 'indices', 20350.00, 2.0, 0.1, 1, 1],
      ['SPX500', 'S&P 500', 'indices', 5860.00, 0.8, 0.1, 1, 1]
    ];

    for (const sym of defaultSymbols) {
      insertSymbol.run(...sym);
    }
  }

  // Seed default admin and demo trader if not exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const salt = bcrypt.genSaltSync(10);
    const adminPass = bcrypt.hashSync('admin123', salt);
    const traderPass = bcrypt.hashSync('trader123', salt);

    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password, role, balance, leverage, kyc_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Super Admin
    insertUser.run('Aventra FX Super Admin', 'admin@royalfx.com', adminPass, 'admin', 500000.0, 100, 'approved');
    // Demo Trader
    insertUser.run('Aventra FX Demo Trader', 'trader@royalfx.com', traderPass, 'user', 10000.0, 100, 'approved');
  }
}

initDb();

module.exports = db;
