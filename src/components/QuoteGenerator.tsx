import React, { useState } from 'react';
import { Calculator, Send, CheckCircle2, Loader2, Sparkles, MapPin, Home, Building2, Save } from 'lucide-react';
import { generateQuote, DevisResult } from '../services/geminiService';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

export function QuoteGenerator() {
  const { user, profile, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<DevisResult | null>(null);
  const [formData, setFormData] = useState({
    type: 'Maison Individuelle',
    surface: 100,
    standing: 'Standard',
    location: 'Dakar, Sénégal',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      const devis = await generateQuote(formData);
      setResult(devis);
    } catch (error) {
      console.error('Error generating quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuote = async () => {
    if (!user) {
      signIn();
      return;
    }
    if (!result) return;

    setSaving(true);
    try {
      // 1. Create a draft project
      const projectRef = await addDoc(collection(db, 'projects'), {
        clientId: user.uid,
        title: `${formData.type} - ${formData.location}`,
        description: formData.description,
        location: formData.location,
        budget: result.totalAmount,
        status: 'draft',
        createdAt: serverTimestamp(),
      });

      // 2. Save the devis under the project
      const devisRef = doc(collection(db, `projects/${projectRef.id}/devis`));
      await setDoc(devisRef, {
        id: devisRef.id,
        projectId: projectRef.id,
        totalAmount: result.totalAmount,
        currency: result.currency,
        breakdown: result.breakdown,
        summary: result.summary,
        generatedAt: new Date().toISOString(),
      });

      setSaved(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects/devis');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#FFF0E6] p-3 rounded-2xl">
            <Calculator className="text-[#FF6B00] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Générateur de Devis IA</h2>
            <p className="text-gray-500 text-sm">Estimez le coût de votre projet en quelques secondes.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Type de Projet</label>
              <select
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B00]"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Maison Individuelle</option>
                <option>Immeuble R+2</option>
                <option>Rénovation</option>
                <option>Extension</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Surface (m²)</label>
              <input
                type="number"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B00]"
                value={formData.surface}
                onChange={(e) => setFormData({ ...formData, surface: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Standing</label>
              <select
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B00]"
                value={formData.standing}
                onChange={(e) => setFormData({ ...formData, standing: e.target.value })}
              >
                <option>Économique</option>
                <option>Standard</option>
                <option>Haut Standing</option>
                <option>Luxe</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Localisation</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B00]"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Description du projet</label>
            <textarea
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B00] min-h-[120px]"
              placeholder="Décrivez votre projet (nombre de chambres, style architectural...)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B00] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#E66000] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Générer mon devis
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Section */}
      <div className="space-y-6">
        {result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1A1A] text-white p-8 rounded-3xl shadow-xl h-full flex flex-col"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Estimation Totale</h3>
                <p className="text-4xl font-black text-[#FF6B00]">{formatCurrency(result.totalAmount)}</p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <CheckCircle2 className="text-[#FF6B00] w-6 h-6" />
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {result.breakdown.map((item, idx) => (
                <div key={idx} className="border-b border-white/10 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{item.category}</span>
                    <span className="text-[#FF6B00] font-mono text-sm">{formatCurrency(item.amount)}</span>
                  </div>
                  <p className="text-xs text-gray-400 italic">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "{result.summary}"
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                  onClick={handleSaveQuote}
                  disabled={saving || saved}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                    saved 
                    ? "bg-green-500 text-white" 
                    : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? "Sauvegardé" : "Sauvegarder"}
                </button>
                <button className="bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">
                  Trouver des artisans
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-gray-100 rounded-3xl h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200">
            <div className="bg-white p-6 rounded-full mb-4 shadow-sm">
              <Building2 className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-400">Prêt à construire ?</h3>
            <p className="text-gray-400 text-sm max-w-[280px] mt-2">
              Remplissez le formulaire pour obtenir une estimation précise basée sur l'IA.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
