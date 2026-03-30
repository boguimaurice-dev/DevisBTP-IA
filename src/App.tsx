/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { QuoteGenerator } from './components/QuoteGenerator';
import { Marketplace } from './components/Marketplace';
import { Dashboard } from './components/Dashboard';
import { RoleSelection } from './components/RoleSelection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Loader2 className="w-10 h-10 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  // If logged in but no profile, force role selection
  if (user && !profile) {
    return <RoleSelection />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onGetStarted={() => setActiveTab('quote')} />;
      case 'quote':
        return <QuoteGenerator />;
      case 'marketplace':
        return <Marketplace />;
      case 'dashboard':
        return user ? <Dashboard /> : <Home onGetStarted={() => setActiveTab('quote')} />;
      default:
        return <Home onGetStarted={() => setActiveTab('quote')} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
