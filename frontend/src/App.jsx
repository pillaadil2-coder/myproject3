import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TradingProvider } from './context/TradingContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import WebTrader from './pages/WebTrader';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import DepositModal from './components/Modals/DepositModal';
import WithdrawModal from './components/Modals/WithdrawModal';
import KycModal from './components/Modals/KycModal';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'trade' | 'dashboard' | 'admin' | 'login' | 'register'
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);

  const { user } = useAuth();

  const handleNavigate = (page) => {
    // If client portal is requested while logged out, redirect to login
    if (page === 'dashboard' && !user) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenDeposit={() => setDepositOpen(true)}
      />

      {/* Pages Switcher */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenDeposit={() => setDepositOpen(true)}
          />
        )}

        {currentPage === 'trade' && (
          <WebTrader
            onNavigate={handleNavigate}
            onOpenDeposit={() => setDepositOpen(true)}
          />
        )}

        {currentPage === 'dashboard' && (
          <ClientDashboard
            onNavigate={handleNavigate}
            onOpenDeposit={() => setDepositOpen(true)}
            onOpenWithdraw={() => setWithdrawOpen(true)}
            onOpenKyc={() => setKycOpen(true)}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}

        {currentPage === 'login' && (
          <Login onNavigate={handleNavigate} />
        )}

        {currentPage === 'register' && (
          <Register onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global Modals */}
      <DepositModal
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
      />

      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
      />

      <KycModal
        isOpen={kycOpen}
        onClose={() => setKycOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TradingProvider>
        <MainApp />
      </TradingProvider>
    </AuthProvider>
  );
}
