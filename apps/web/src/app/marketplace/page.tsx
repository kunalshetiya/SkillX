'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { marketplaceService, MarketplaceSkill } from '@web/features/marketplace/api/marketplace-service';
import { SkillCard } from '@web/features/marketplace/components/SkillCard';

export default function MarketplacePage() {
  const [skills, setSkills] = useState<MarketplaceSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters state
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'OFFERING' | 'LEARNING'>('OFFERING');
  const [level, setLevel] = useState('');

  useEffect(() => {
    loadSkills();
  }, [type, level]); // Reload when type or level changes

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await marketplaceService.getSkills({ search, type, level });
      setSkills(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSkills();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Marketplace</h1>
          <p className="text-gray-500 font-medium mt-1">Discover skills, find mentors, and start bartering.</p>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-lg relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for any skill (React, Piano, Italian...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 space-y-6 sticky top-24">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-8">
            <div className="flex items-center gap-2 text-gray-900 font-bold border-b pb-4">
              <SlidersHorizontal size={18} className="text-blue-600" />
              Filters
            </div>

            {/* Type Filter */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">I am looking for</label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setType('OFFERING')}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                    type === 'OFFERING' 
                    ? 'bg-blue-50 border-blue-600 text-blue-700' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  People Teaching
                  <div className={`w-2 h-2 rounded-full ${type === 'OFFERING' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                </button>
                <button
                  onClick={() => setType('LEARNING')}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                    type === 'LEARNING' 
                    ? 'bg-purple-50 border-purple-600 text-purple-700' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  People Learning
                  <div className={`w-2 h-2 rounded-full ${type === 'LEARNING' ? 'bg-purple-600' : 'bg-gray-300'}`} />
                </button>
              </div>
            </div>

            {/* Level Filter */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expertise Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold appearance-none cursor-pointer"
              >
                <option value="">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setSearch('');
                setType('OFFERING');
                setLevel('');
              }}
              className="w-full py-3 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
            >
              Reset All Filters
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
            <h3 className="font-bold mb-2">Can't find a skill?</h3>
            <p className="text-blue-100 text-sm mb-4 leading-relaxed">
              Post a learning request and let experts find you!
            </p>
            <button className="w-full py-2.5 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors">
              Post Request
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white rounded-3xl border border-dashed">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="text-gray-500 font-medium italic">Searching for the best matches...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-bold">Oops! Something went wrong.</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <button onClick={loadSkills} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold">
                Try Again
              </button>
            </div>
          ) : skills.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 py-32 px-8 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Search size={32} className="text-gray-400" />
              </div>
              <div className="max-w-xs mx-auto">
                <h3 className="text-xl font-bold text-gray-900">No skills found</h3>
                <p className="text-gray-500 text-sm mt-2">
                  We couldn't find any results matching your search. Try adjusting your filters or searching for something else.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
