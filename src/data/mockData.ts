export type Role = 'admin' | 'agent';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  district?: string;
}

export interface Citizen {
  id: string;
  nationalId: string;
  name: string;
  dob: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  phone: string;
  status: 'Received' | 'Not Received';
  registrationDate: string;
  registeredBy?: string;
  distributionDate?: string;
  agentName?: string;
  distributionLocation?: {
    district: string;
    sector: string;
    cell: string;
    village: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  username: string;
  password: string;
  district: string;
  status: 'active' | 'suspended' | 'disabled';
  citizensServed: number;
}

export interface AuditLog {
  id: string;
  action:
  'CREATE_CITIZEN' |
  'CONFIRM_DISTRIBUTION' |
  'CREATE_AGENT' |
  'SUSPEND_AGENT' |
  'DISABLE_AGENT' |
  'ENABLE_AGENT' |
  'LOGIN';
  performedBy: string;
  performedByName: string;
  targetId?: string;
  targetName?: string;
  timestamp: string;
  metadata?: any;
}

export const rwandaLocations = {
  Kigali: {
    Gasabo: {
      Kimironko: {
        Kibagabaga: ['Karisimbi', 'Nyiragongo', 'Muhabura'],
        Nyagatovu: ['Ituze', 'Amahoro', 'Ubumwe']
      },
      Remera: {
        Rukiri: ['Rebero', 'Kigarama', 'Gasharu'],
        Nyabisindu: ['Amizero', 'Isangano']
      }
    },
    Kicukiro: {
      Kanombe: {
        Karama: ['Kabeza', 'Rubirizi'],
        Rubirizi: ['Gako', 'Kibenga']
      },
      Niboye: {
        Gatare: ['Kanserege', 'Kagarama']
      }
    },
    Nyarugenge: {
      Nyamirambo: {
        Mumena: ['Kivugiza', 'Rwezamenyo'],
        Kivugiza: ['Gasharu', 'Kiberinka']
      }
    }
  },
  Northern: {
    Musanze: {
      Muhoza: {
        Kigombe: ['Ruhengeri', 'Mpenge'],
        Cyabararika: ['Kabeza', 'Gatagara']
      },
      Kinigi: {
        Bisate: ['Kaguhu', 'Nyabigoma']
      }
    },
    Gicumbi: {
      Byumba: {
        Kibali: ['Gacurabwenge', 'Kivugiza']
      }
    }
  },
  Southern: {
    Huye: {
      Ngoma: {
        Matyazo: ['Kigarama', 'Rango'],
        Tumba: ['Cyimana', 'Mpare']
      }
    },
    Muhanga: {
      Nyamabuye: {
        Gahogo: ['Kavumu', 'Kanyinya']
      }
    }
  },
  Eastern: {
    Rwamagana: {
      Kigabiro: {
        Cyanya: ['Bwiza', 'Sibagire']
      }
    },
    Bugesera: {
      Nyamata: {
        Kanazi: ['Murama', 'Kibenga']
      }
    }
  },
  Western: {
    Rubavu: {
      Gisenyi: {
        Mbugangari: ['Kivumu', 'Gacuba']
      }
    },
    Rusizi: {
      Kamembe: {
        Gihundwe: ['Cyangugu', 'Kamurera']
      }
    }
  }
};

const firstNames = [
'Jean Claude',
'Marie Claire',
'Emmanuel',
'Chantal',
'Eric',
'Alice',
'Olivier',
'Claudine',
'Innocent',
'Nadine',
'Patrick',
'Aline',
'Thierry',
'Diane',
'Bosco',
'Grace'];

const lastNames = [
'Uwimana',
'Mukamana',
'Habimana',
'Mutoni',
'Nshimiyimana',
'Uwamahoro',
'Ndayisaba',
'Iradukunda',
'Hakizimana',
'Mugisha',
'Bizimana',
'Kamanzi',
'Ndahiro',
'Rutayisire'];


const generateRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).
  toISOString().
  split('T')[0];
};

const generateNationalId = () => {
  const year = Math.floor(Math.random() * (2005 - 1940 + 1)) + 1940;
  const gender = Math.random() > 0.5 ? '7' : '8';
  const randomDigits = Math.floor(Math.random() * 10000000).
  toString().
  padStart(7, '0');
  const randomEnd = Math.floor(Math.random() * 100).
  toString().
  padStart(2, '0');
  return `1${year}${gender}00${randomDigits}${randomEnd}`;
};

const getRandomLocation = () => {
  const provinces = Object.keys(rwandaLocations);
  const province = provinces[Math.floor(Math.random() * provinces.length)];

  const districts = Object.keys(
    rwandaLocations[province as keyof typeof rwandaLocations]
  );
  const district = districts[Math.floor(Math.random() * districts.length)];

  const sectors = Object.keys((rwandaLocations as any)[province][district]);
  const sector = sectors[Math.floor(Math.random() * sectors.length)];

  const cells = Object.keys(
    (rwandaLocations as any)[province][district][sector]
  );
  const cell = cells[Math.floor(Math.random() * cells.length)];

  const villages = (rwandaLocations as any)[province][district][sector][cell];
  const village = villages[Math.floor(Math.random() * villages.length)];

  return { province, district, sector, cell, village };
};

export const generateMockAgents = (): Agent[] => {
  return [
  {
    id: 'a1',
    name: 'Agent One',
    username: 'agent1',
    password: 'agent123',
    district: 'Gasabo',
    status: 'active',
    citizensServed: 145
  },
  {
    id: 'a2',
    name: 'Agent Two',
    username: 'agent2',
    password: 'agent123',
    district: 'Kicukiro',
    status: 'active',
    citizensServed: 89
  },
  {
    id: 'a3',
    name: 'Agent Three',
    username: 'agent3',
    password: 'agent123',
    district: 'Nyarugenge',
    status: 'active',
    citizensServed: 210
  },
  {
    id: 'a4',
    name: 'Agent Four',
    username: 'agent4',
    password: 'agent123',
    district: 'Musanze',
    status: 'suspended',
    citizensServed: 45
  },
  {
    id: 'a5',
    name: 'Agent Five',
    username: 'agent5',
    password: 'agent123',
    district: 'Huye',
    status: 'active',
    citizensServed: 112
  },
  {
    id: 'a6',
    name: 'Agent Six',
    username: 'agent6',
    password: 'agent123',
    district: 'Rwamagana',
    status: 'active',
    citizensServed: 76
  },
  {
    id: 'a7',
    name: 'Agent Seven',
    username: 'agent7',
    password: 'agent123',
    district: 'Rubavu',
    status: 'active',
    citizensServed: 198
  },
  {
    id: 'a8',
    name: 'Agent Eight',
    username: 'agent8',
    password: 'agent123',
    district: 'Bugesera',
    status: 'disabled',
    citizensServed: 23
  }];

};

export const generateMockCitizens = (count: number = 100): Citizen[] => {
  const citizens: Citizen[] = [];
  const agents = generateMockAgents();
  const activeAgents = agents.filter((a) => a.status === 'active');

  for (let i = 0; i < count; i++) {
    const isReceived = Math.random() > 0.4; // ~60% received
    const loc = getRandomLocation();
    const regDate = generateRandomDate(
      new Date(2023, 0, 1),
      new Date(2023, 11, 31)
    );

    let distDate;
    let agentName;
    let distLoc;

    if (isReceived) {
      distDate = generateRandomDate(new Date(regDate), new Date());
      const agent =
      activeAgents[Math.floor(Math.random() * activeAgents.length)];
      agentName = agent.name;
      distLoc = {
        district: agent.district,
        sector: loc.sector,
        cell: loc.cell,
        village: loc.village
      };
    }

    citizens.push({
      id: `c${i + 1}`,
      nationalId: generateNationalId(),
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      dob: generateRandomDate(new Date(1940, 0, 1), new Date(2005, 11, 31)),
      ...loc,
      phone: `078${Math.floor(Math.random() * 10000000).
      toString().
      padStart(7, '0')}`,
      status: isReceived ? 'Received' : 'Not Received',
      registrationDate: regDate,
      registeredBy:
      activeAgents[Math.floor(Math.random() * activeAgents.length)].name,
      distributionDate: distDate,
      agentName: agentName,
      distributionLocation: distLoc
    });
  }

  return citizens.sort(
    (a, b) =>
    new Date(b.registrationDate).getTime() -
    new Date(a.registrationDate).getTime()
  );
};

export const generateMockAuditLogs = (): AuditLog[] => {
  const now = Date.now();
  return [
  {
    id: 'l1',
    action: 'LOGIN',
    performedBy: 'a1',
    performedByName: 'Agent One',
    timestamp: new Date(now - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'l2',
    action: 'CREATE_CITIZEN',
    performedBy: 'a1',
    performedByName: 'Agent One',
    targetId: 'c101',
    targetName: 'Jean Baptiste',
    timestamp: new Date(now - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'l3',
    action: 'CONFIRM_DISTRIBUTION',
    performedBy: 'a2',
    performedByName: 'Agent Two',
    targetId: 'c45',
    targetName: 'Marie Claire',
    timestamp: new Date(now - 1000 * 60 * 60).toISOString()
  },
  {
    id: 'l4',
    action: 'SUSPEND_AGENT',
    performedBy: 'u1',
    performedByName: 'System Admin',
    targetId: 'a4',
    targetName: 'Agent Four',
    timestamp: new Date(now - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'l5',
    action: 'CREATE_AGENT',
    performedBy: 'u1',
    performedByName: 'System Admin',
    targetId: 'a8',
    targetName: 'Agent Eight',
    timestamp: new Date(now - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'l6',
    action: 'DISABLE_AGENT',
    performedBy: 'u1',
    performedByName: 'System Admin',
    targetId: 'a8',
    targetName: 'Agent Eight',
    timestamp: new Date(now - 1000 * 60 * 60 * 25).toISOString()
  },
  {
    id: 'l7',
    action: 'CONFIRM_DISTRIBUTION',
    performedBy: 'a3',
    performedByName: 'Agent Three',
    targetId: 'c12',
    targetName: 'Emmanuel Habimana',
    timestamp: new Date(now - 1000 * 60 * 60 * 48).toISOString()
  }];

};