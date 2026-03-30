import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Search, MapPin, Star, ShieldCheck, MessageSquare, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

interface Artisan {
  uid: string;
  companyName: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  baseRate: number;
  description: string;
  verified: boolean;
  photoURL?: string;
  location?: string;
}

export function Marketplace() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'artisans'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Artisan));
      setArtisans(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'artisans');
    });

    return () => unsubscribe();
  }, []);

  const filteredArtisans = artisans.filter(a => {
    const matchesSearch = a.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || a.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const specialties = [
    { id: 'all', label: 'Tous les métiers' },
    { id: 'mason', label: 'Maçonnerie' },
    { id: 'electrician', label: 'Électricité' },
    { id: 'plumber', label: 'Plomberie' },
    { id: 'carpenter', label: 'Menuiserie' },
    { id: 'painter', label: 'Peinture' },
  ];

  return (
    <div className="space-y-8">
      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un artisan ou un métier..."
            className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-[#FF6B00]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {specialties.map((s) => (
            <button
              key={s.id}
              onClick={() => setSpecialtyFilter(s.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                specialtyFilter === s.id 
                ? "bg-[#FF6B00] text-white" 
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white h-[400px] rounded-3xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtisans.map((artisan) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={artisan.uid}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={artisan.photoURL || `https://picsum.photos/seed/${artisan.uid}/800/600`} 
                  alt={artisan.companyName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px] font-black">{artisan.rating}</span>
                  <span className="text-[10px] text-gray-400">({artisan.reviewCount})</span>
                </div>
                {artisan.verified && (
                  <div className="absolute top-4 right-4 bg-[#FF6B00] text-white p-1.5 rounded-full shadow-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-[#FF6B00] transition-colors">{artisan.companyName}</h3>
                    <p className="text-xs text-[#FF6B00] font-bold uppercase tracking-wider">{artisan.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">À partir de</p>
                    <p className="text-sm font-black">{formatCurrency(artisan.baseRate)}/m²</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-6 leading-relaxed">
                  {artisan.description || "Artisan qualifié avec plus de 10 ans d'expérience dans le domaine du BTP."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                    <MapPin className="w-3 h-3" />
                    {artisan.location || "Dakar, SN"}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="flex items-center gap-1 bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-gray-800 transition-colors">
                      Voir Profil
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
