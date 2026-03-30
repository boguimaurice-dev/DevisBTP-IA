import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Construction, ShieldCheck, ArrowRight, Star, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export function Home({ onGetStarted }: { onGetStarted: () => void }) {
  const { signIn, user } = useAuth();

  const stats = [
    { label: 'Artisans Vérifiés', value: '500+', icon: ShieldCheck },
    { label: 'Devis Générés', value: '12k+', icon: Construction },
    { label: 'Note Moyenne', value: '4.8/5', icon: Star },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center pt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FFF0E6] text-[#FF6B00] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6"
        >
          Le futur du BTP en Afrique
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] max-w-4xl mb-8">
          Construisez votre projet avec <span className="text-[#FF6B00]">l'intelligence</span> artificielle.
        </h1>
        
        <p className="text-gray-500 text-lg max-w-2xl mb-12 leading-relaxed">
          Générez des devis précis en 30 secondes et connectez-vous aux meilleurs artisans qualifiés de votre région.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onGetStarted}
            className="bg-[#FF6B00] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#E66000] transition-all shadow-lg shadow-[#FF6B00]/20"
          >
            Générer un devis gratuit
            <ArrowRight className="w-5 h-5" />
          </button>
          {!user && (
            <button 
              onClick={signIn}
              className="bg-white border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              Devenir Artisan Partenaire
            </button>
          )}
        </div>

        {/* Floating Elements Mockup */}
        <div className="mt-20 w-full max-w-5xl relative">
          <div className="bg-white rounded-[40px] shadow-2xl p-4 border border-gray-100 overflow-hidden aspect-video relative">
            <img 
              src="https://picsum.photos/seed/construction/1200/800" 
              alt="Dashboard Preview" 
              className="w-full h-full object-cover rounded-[32px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            
            {/* Floating Card 1 */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-10 left-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Devis Approuvé</p>
                  <p className="text-sm font-black">12.500.000 FCFA</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-10 right-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="text-orange-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Prochain Chantier</p>
                  <p className="text-sm font-black">Villa R+1 - Plateau</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="bg-[#FFF0E6] p-4 rounded-2xl">
              <stat.icon className="text-[#FF6B00] w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black tracking-tight">Comment ça marche ?</h2>
          <p className="text-gray-500">Une solution complète de l'idée à la remise des clés.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Générez votre devis', desc: 'Utilisez notre IA pour estimer le coût réel de vos travaux selon le standing souhaité.', step: '01' },
            { title: 'Choisissez vos artisans', desc: 'Accédez à une marketplace d\'artisans vérifiés et notés par la communauté.', step: '02' },
            { title: 'Suivez le chantier', desc: 'Gérez les paiements, les étapes et communiquez en temps réel avec vos prestataires.', step: '03' },
          ].map((item, idx) => (
            <div key={idx} className="relative group">
              <span className="text-8xl font-black text-gray-100 absolute -top-10 -left-4 group-hover:text-[#FFF0E6] transition-colors">{item.step}</span>
              <div className="relative pt-4">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
