import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Construction, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

export function RoleSelection() {
  const { updateRole } = useAuth();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight">Bienvenue sur DevisBTP IA</h1>
          <p className="text-gray-500 text-lg">Choisissez votre profil pour commencer l'aventure.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => updateRole('client')}
            className="group bg-white p-8 rounded-[40px] border-2 border-gray-100 hover:border-[#FF6B00] transition-all text-left space-y-6 shadow-sm hover:shadow-xl"
          >
            <div className="bg-gray-50 p-4 rounded-2xl w-fit group-hover:bg-[#FFF0E6] transition-colors">
              <User className="w-8 h-8 text-gray-400 group-hover:text-[#FF6B00]" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Je suis un Client</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Je souhaite générer des devis et trouver des artisans pour mes projets.</p>
            </div>
            <div className="flex items-center gap-2 text-[#FF6B00] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Commencer <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => updateRole('artisan')}
            className="group bg-white p-8 rounded-[40px] border-2 border-gray-100 hover:border-[#FF6B00] transition-all text-left space-y-6 shadow-sm hover:shadow-xl"
          >
            <div className="bg-gray-50 p-4 rounded-2xl w-fit group-hover:bg-[#FFF0E6] transition-colors">
              <Briefcase className="w-8 h-8 text-gray-400 group-hover:text-[#FF6B00]" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Je suis un Artisan</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Je souhaite proposer mes services et trouver de nouveaux chantiers.</p>
            </div>
            <div className="flex items-center gap-2 text-[#FF6B00] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              S'inscrire <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-medium pt-8">
          <ShieldCheck className="w-4 h-4" />
          Vos données sont sécurisées et vérifiées
        </div>
      </motion.div>
    </div>
  );
}
