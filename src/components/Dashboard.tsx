import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { LayoutDashboard, Briefcase, FileText, MessageSquare, Settings, Plus, ArrowUpRight, Clock, CheckCircle2, Construction, Star } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';

export function Dashboard() {
  const { profile, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'projects'),
      where(profile?.role === 'client' ? 'clientId' : 'artisanId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    return () => unsubscribe();
  }, [user, profile]);

  if (profile?.role === 'artisan') {
    return <ArtisanDashboard projects={projects} loading={loading} />;
  }

  return <ClientDashboard projects={projects} loading={loading} />;
}

function ClientDashboard({ projects, loading }: { projects: any[], loading: boolean }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Tableau de bord</h2>
          <p className="text-gray-500 text-sm">Gérez vos projets et vos devis en cours.</p>
        </div>
        <button className="bg-[#FF6B00] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#E66000] transition-all">
          <Plus className="w-5 h-5" />
          Nouveau Projet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Projets Actifs" value={projects.filter(p => p.status === 'in-progress').length} icon={Briefcase} color="orange" />
        <StatCard label="Devis Reçus" value={12} icon={FileText} color="blue" />
        <StatCard label="Messages" value={4} icon={MessageSquare} color="green" />
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold">Mes Projets Récents</h3>
          <button className="text-xs font-bold text-[#FF6B00] hover:underline">Voir tout</button>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Chargement...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <FileText className="text-gray-300 w-8 h-8" />
              </div>
              <p className="text-gray-400 text-sm">Aucun projet pour le moment.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <Construction className="text-gray-400 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{project.title}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{project.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Budget</p>
                    <p className="text-sm font-black">{formatCurrency(project.budget || 0)}</p>
                  </div>
                  <StatusBadge status={project.status} />
                  <button className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ArtisanDashboard({ projects, loading }: { projects: any[], loading: boolean }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Espace Artisan</h2>
          <p className="text-gray-500 text-sm">Suivez vos opportunités et vos chantiers.</p>
        </div>
        <button className="bg-[#1A1A1A] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all">
          <Settings className="w-5 h-5" />
          Modifier Profil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Chantiers en cours" value={3} icon={Briefcase} color="orange" />
        <StatCard label="Offres envoyées" value={8} icon={Send} color="blue" />
        <StatCard label="Note globale" value="4.9" icon={Star} color="yellow" />
      </div>

      {/* Similar list for artisan projects/proposals */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-12 text-center text-gray-400">
        Fonctionnalités artisan en cours de déploiement...
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    orange: 'bg-[#FFF0E6] text-[#FF6B00]',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={cn("p-4 rounded-2xl", colors[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'draft': 'bg-gray-100 text-gray-500',
    'open': 'bg-blue-100 text-blue-600',
    'in-progress': 'bg-orange-100 text-orange-600',
    'completed': 'bg-green-100 text-green-600',
  };

  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", styles[status] || styles.draft)}>
      {status === 'in-progress' ? 'En cours' : status}
    </span>
  );
}

function Send({ className }: { className?: string }) {
  return <ArrowUpRight className={className} />;
}
