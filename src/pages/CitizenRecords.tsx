import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { FilterBar } from '../components/FilterBar';
import { CitizenTable } from '../components/CitizenTable';
export const CitizenRecords = () => {
  const { citizens } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const districts = useMemo(() => {
    const uniqueDistricts = new Set(citizens.map((c) => c.district));
    return Array.from(uniqueDistricts).sort();
  }, [citizens]);
  const filteredCitizens = useMemo(() => {
    return citizens.filter((c) => {
      const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nationalId.includes(searchTerm);
      const matchesDistrict = districtFilter ?
      c.district === districtFilter :
      true;
      const matchesStatus = statusFilter ? c.status === statusFilter : true;
      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [citizens, searchTerm, districtFilter, statusFilter]);
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Citizen Records</h1>
        <p className="text-slate-500 mt-1">
          View and filter all registered citizens and their distribution status.
        </p>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        districts={districts}
        data={filteredCitizens} />
      

      <div className="flex-1 min-h-0">
        <CitizenTable citizens={filteredCitizens} />
      </div>
    </div>);

};