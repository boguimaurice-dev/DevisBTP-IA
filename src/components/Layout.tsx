import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserCircle, Construction, LogOut, LayoutDashboard, Search, Calculator } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { user, profile, signIn, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: 'Accueil', icon: LayoutDashboard },
    { id: 'quote', label: 'Générateur', icon: Calculator },
    { id: 'marketplace', label: 'Artisans', icon: Search },
    { id: 'dashboard', label: 'Mon Espace', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-[#FF6B00] p-2 rounded-lg">
              <Construction className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">DevisBTP <span className="text-[#FF6B00]">IA</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#FF6B00]",
                  activeTab === item.id ? "text-[#FF6B00]" : "text-gray-500"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold">{user.displayName}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{profile?.role || 'Utilisateur'}</p>
                </div>
                <img src={user.photoURL || ''} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                <button onClick={signOut} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Se connecter
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1",
              activeTab === item.id ? "text-[#FF6B00]" : "text-gray-400"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
