import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { rwandaLocations } from '../data/mockData';
import { toast } from 'sonner';
import { Save, Info } from 'lucide-react';
export const RegisterCitizenForm = () => {
  const { addCitizen } = useData();
  const { user } = useAuth();
  const [nationalId, setNationalId] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [sector, setSector] = useState('');
  const [cell, setCell] = useState('');
  const [village, setVillage] = useState('');
  // Determine agent's province based on their assigned district
  const agentProvince = useMemo(() => {
    if (!user?.district) return '';
    for (const [prov, dists] of Object.entries(rwandaLocations)) {
      if (Object.keys(dists).includes(user.district)) {
        return prov;
      }
    }
    return '';
  }, [user]);
  // Auto-fill and lock province and district
  useEffect(() => {
    if (agentProvince) setProvince(agentProvince);
    if (user?.district) setDistrict(user.district);
  }, [agentProvince, user]);
  // Location Cascading Logic
  const sectors = useMemo(() => {
    if (!province || !district) return [];
    return Object.keys((rwandaLocations as any)[province][district]);
  }, [province, district]);
  const cells = useMemo(() => {
    if (!province || !district || !sector) return [];
    return Object.keys((rwandaLocations as any)[province][district][sector]);
  }, [province, district, sector]);
  const villages = useMemo(() => {
    if (!province || !district || !sector || !cell) return [];
    return (rwandaLocations as any)[province][district][sector][cell];
  }, [province, district, sector, cell]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.length !== 16 || !/^\d+$/.test(nationalId)) {
      toast.error('National ID must be exactly 16 digits');
      return;
    }
    if (!user) return;
    const success = addCitizen(
      {
        nationalId,
        name,
        dob,
        province,
        district,
        sector,
        cell,
        village,
        phone,
        status: 'Not Received',
        registrationDate: new Date().toISOString().split('T')[0],
        registeredBy: user.name
      },
      {
        id: user.id,
        name: user.name
      }
    );
    if (success) {
      // Reset form
      setNationalId('');
      setName('');
      setDob('');
      setPhone('');
      setSector('');
      setCell('');
      setVillage('');
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="px-6 py-5 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Register New Citizen
        </h2>
        <p className="text-sm text-slate-500">
          Enter citizen details to add them to the distribution system.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">
              Personal Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                National ID (16 digits)
              </label>
              <input
                type="text"
                required
                maxLength={16}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm font-mono"
                placeholder="1200870045512034" />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                placeholder="Jean Claude Uwimana" />
              
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm" />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                  placeholder="078..." />
                
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">
              Location Details
            </h3>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2 items-start">
              <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800">
                Province and District are auto-assigned based on your agent
                profile. You can only register citizens within your assigned
                district.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Province
                </label>
                <input
                  type="text"
                  disabled
                  value={province}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 sm:text-sm cursor-not-allowed" />
                
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  disabled
                  value={district}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 sm:text-sm cursor-not-allowed" />
                
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Sector
                </label>
                <select
                  required
                  value={sector}
                  onChange={(e) => {
                    setSector(e.target.value);
                    setCell('');
                    setVillage('');
                  }}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
                  
                  <option value="">Select Sector</option>
                  {sectors.map((s) =>
                  <option key={s} value={s}>
                      {s}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Cell
                </label>
                <select
                  required
                  disabled={!sector}
                  value={cell}
                  onChange={(e) => {
                    setCell(e.target.value);
                    setVillage('');
                  }}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm disabled:bg-slate-100">
                  
                  <option value="">Select Cell</option>
                  {cells.map((c) =>
                  <option key={c} value={c}>
                      {c}
                    </option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Village
              </label>
              <select
                required
                disabled={!cell}
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm disabled:bg-slate-100">
                
                <option value="">Select Village</option>
                {villages.map((v: string) =>
                <option key={v} value={v}>
                    {v}
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            
            <Save size={18} />
            Register Citizen
          </button>
        </div>
      </form>
    </div>);

};