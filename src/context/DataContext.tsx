import React, { useEffect, useState, createContext, useContext } from 'react';
import {
  Citizen,
  Agent,
  AuditLog,
  generateMockCitizens,
  generateMockAgents,
  generateMockAuditLogs } from
'../data/mockData';
import { toast } from 'sonner';
interface DataContextType {
  citizens: Citizen[];
  agents: Agent[];
  auditLogs: AuditLog[];
  addCitizen: (
  citizen: Omit<Citizen, 'id'>,
  performedBy: {
    id: string;
    name: string;
  })
  => boolean;
  updateCitizenStatus: (
  nationalId: string,
  agent: {
    id: string;
    name: string;
    district: string;
    status: string;
  },
  location?: any)
  => boolean;
  addAgent: (
  agent: Omit<Agent, 'id' | 'citizensServed'>,
  performedBy: {
    id: string;
    name: string;
  })
  => void;
  setAgentStatus: (
  id: string,
  status: 'active' | 'suspended' | 'disabled',
  performedBy: {
    id: string;
    name: string;
  })
  => void;
  loginAgent: (
  username: string,
  password: string)
  => {
    success: boolean;
    agent: Agent | null;
    message: string;
  };
  getTopAgents: (limit: number) => Agent[];
}
const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider = ({ children }: {children: ReactNode;}) => {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const initData = () => {
    setCitizens(generateMockCitizens(100));
    setAgents(generateMockAgents());
    setAuditLogs(generateMockAuditLogs());
  };
  useEffect(() => {
    initData();
  }, []);
  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };
  const addCitizen = (
  citizenData: Omit<Citizen, 'id'>,
  performedBy: {
    id: string;
    name: string;
  }) =>
  {
    // Prevent duplicates
    const exists = citizens.some((c) => c.nationalId === citizenData.nationalId);
    if (exists) {
      toast.error('Citizen with this National ID is already registered');
      return false;
    }
    const newCitizen: Citizen = {
      ...citizenData,
      id: `c${Date.now()}`
    };
    setCitizens((prev) => [newCitizen, ...prev]);
    addAuditLog({
      action: 'CREATE_CITIZEN',
      performedBy: performedBy.id,
      performedByName: performedBy.name,
      targetId: newCitizen.id,
      targetName: newCitizen.name,
      metadata: {
        nationalId: newCitizen.nationalId
      }
    });
    toast.success('Citizen registered successfully');
    return true;
  };
  const updateCitizenStatus = (
  nationalId: string,
  agent: {
    id: string;
    name: string;
    district: string;
    status: string;
  },
  location?: any) =>
  {
    if (agent.status === 'suspended') {
      toast.error(
        'Your account is suspended. You cannot confirm distributions.'
      );
      return false;
    }
    let found = false;
    let alreadyReceived = false;
    let targetCitizenName = '';
    let targetCitizenId = '';
    setCitizens((prev) =>
    prev.map((c) => {
      if (c.nationalId === nationalId) {
        found = true;
        targetCitizenName = c.name;
        targetCitizenId = c.id;
        if (c.status === 'Received') {
          alreadyReceived = true;
          return c;
        }
        return {
          ...c,
          status: 'Received' as const,
          distributionDate: new Date().toISOString().split('T')[0],
          agentName: agent.name,
          distributionLocation: location || {
            district: agent.district,
            sector: c.sector,
            cell: c.cell,
            village: c.village
          }
        };
      }
      return c;
    })
    );
    if (!found) {
      toast.error('Citizen not found with this National ID');
      return false;
    }
    if (alreadyReceived) {
      toast.warning('This citizen has already received their distribution');
      return false;
    }
    setAgents((prev) =>
    prev.map((a) =>
    a.id === agent.id ?
    {
      ...a,
      citizensServed: a.citizensServed + 1
    } :
    a
    )
    );
    addAuditLog({
      action: 'CONFIRM_DISTRIBUTION',
      performedBy: agent.id,
      performedByName: agent.name,
      targetId: targetCitizenId,
      targetName: targetCitizenName,
      metadata: {
        nationalId
      }
    });
    toast.success('Distribution confirmed successfully');
    return true;
  };
  const addAgent = (
  agentData: Omit<Agent, 'id' | 'citizensServed'>,
  performedBy: {
    id: string;
    name: string;
  }) =>
  {
    const existing = agents.find((a) => a.username === agentData.username);
    if (existing) {
      toast.error('Username already taken. Please choose a different one.');
      return;
    }
    const newAgent: Agent = {
      ...agentData,
      id: `a${Date.now()}`,
      citizensServed: 0
    };
    setAgents((prev) => [...prev, newAgent]);
    addAuditLog({
      action: 'CREATE_AGENT',
      performedBy: performedBy.id,
      performedByName: performedBy.name,
      targetId: newAgent.id,
      targetName: newAgent.name
    });
    toast.success('Agent created successfully');
  };
  const setAgentStatus = (
  id: string,
  status: 'active' | 'suspended' | 'disabled',
  performedBy: {
    id: string;
    name: string;
  }) =>
  {
    let targetAgentName = '';
    setAgents((prev) =>
    prev.map((a) => {
      if (a.id === id) {
        targetAgentName = a.name;
        return {
          ...a,
          status
        };
      }
      return a;
    })
    );
    let action: AuditLog['action'] = 'ENABLE_AGENT';
    if (status === 'suspended') action = 'SUSPEND_AGENT';
    if (status === 'disabled') action = 'DISABLE_AGENT';
    addAuditLog({
      action,
      performedBy: performedBy.id,
      performedByName: performedBy.name,
      targetId: id,
      targetName: targetAgentName,
      metadata: {
        newStatus: status
      }
    });
    toast.success(`Agent status updated to ${status}`);
  };
  const loginAgent = (username: string, password: string) => {
    const agent = agents.find(
      (a) => a.username === username && a.password === password
    );
    if (!agent) {
      return {
        success: false,
        agent: null,
        message:
        'Invalid credentials. Please check your username and password.'
      };
    }
    if (agent.status === 'disabled') {
      return {
        success: false,
        agent,
        message:
        'Your account has been disabled. Please contact the administrator.'
      };
    }
    addAuditLog({
      action: 'LOGIN',
      performedBy: agent.id,
      performedByName: agent.name
    });
    if (agent.status === 'suspended') {
      return {
        success: true,
        agent,
        message: 'Account suspended — distribution confirmation restricted.'
      };
    }
    return {
      success: true,
      agent,
      message: `Welcome back, ${agent.name}`
    };
  };
  const getTopAgents = (limit: number) => {
    return [...agents].
    sort((a, b) => b.citizensServed - a.citizensServed).
    slice(0, limit);
  };
  return (
    <DataContext.Provider
      value={{
        citizens,
        agents,
        auditLogs,
        addCitizen,
        updateCitizenStatus,
        addAgent,
        setAgentStatus,
        loginAgent,
        getTopAgents
      }}>
      
      {children}
    </DataContext.Provider>);

};
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};