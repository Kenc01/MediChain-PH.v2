import { randomUUID } from "crypto";

interface SimpleUser {
  id: string;
  username: string;
  password: string;
  fullName: string;
  bloodType: string | null;
  nftId: string;
}

interface PatientRecord {
  id: string;
  nftId: string;
  patientName: string;
  bloodType: string | null;
  allergies: string[];
  medications: string[];
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  medicalRecords: Array<{
    date: string;
    diagnosis: string;
    treatment: string;
    hospital: string;
    notes?: string;
  }>;
}

interface EmergencyAccessLog {
  id: string;
  patientRecordId: string;
  accessedBy: string;
  reason: string;
  accessedAt: Date;
  expiresAt: Date;
}

class MemStorage {
  private users: Map<string, SimpleUser> = new Map();
  private patientRecords: Map<string, PatientRecord> = new Map();
  private emergencyLogs: EmergencyAccessLog[] = [];

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    const demoNftId = "NFT-DEMO-001";
    
    const demoUser: SimpleUser = {
      id: randomUUID(),
      username: "demo",
      password: "demo123",
      fullName: "Maria Santos",
      bloodType: "O+",
      nftId: demoNftId,
    };
    this.users.set(demoUser.id, demoUser);

    const demoRecord: PatientRecord = {
      id: randomUUID(),
      nftId: demoNftId,
      patientName: "Maria Santos",
      bloodType: "O+",
      allergies: ["Penicillin", "Shellfish"],
      medications: ["Metformin 500mg", "Lisinopril 10mg"],
      emergencyContacts: [
        {
          name: "Juan Santos",
          relationship: "Husband",
          phone: "+63 917 123 4567",
        },
        {
          name: "Dr. Reyes",
          relationship: "Primary Care",
          phone: "+63 917 987 6543",
        },
      ],
      medicalRecords: [
        {
          date: "2024-11-15",
          diagnosis: "Type 2 Diabetes - Routine Checkup",
          treatment: "Continue current medication, diet modification",
          hospital: "Philippine General Hospital",
          notes: "HbA1c at 6.8%, well controlled",
        },
        {
          date: "2024-09-20",
          diagnosis: "Hypertension Follow-up",
          treatment: "Blood pressure well controlled at 120/80",
          hospital: "St. Luke's Medical Center",
        },
        {
          date: "2024-06-10",
          diagnosis: "Annual Physical Examination",
          treatment: "All results within normal range",
          hospital: "Makati Medical Center",
          notes: "Recommended vitamin D supplementation",
        },
      ],
    };
    this.patientRecords.set(demoRecord.nftId, demoRecord);
  }

  async getUserByUsername(username: string): Promise<SimpleUser | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createSimpleUser(data: {
    username: string;
    password: string;
    fullName: string;
    bloodType: string | null;
    nftId: string;
  }): Promise<SimpleUser> {
    const user: SimpleUser = {
      id: randomUUID(),
      ...data,
    };
    this.users.set(user.id, user);

    const patientRecord: PatientRecord = {
      id: randomUUID(),
      nftId: data.nftId,
      patientName: data.fullName,
      bloodType: data.bloodType,
      allergies: [],
      medications: [],
      emergencyContacts: [],
      medicalRecords: [],
    };
    this.patientRecords.set(data.nftId, patientRecord);

    return user;
  }

  async getPatientRecordByNftId(nftId: string): Promise<PatientRecord | undefined> {
    return this.patientRecords.get(nftId);
  }

  async createEmergencyAccessLog(data: {
    patientRecordId: string;
    accessedBy: string;
    reason: string;
    accessedAt: Date;
    expiresAt: Date;
  }): Promise<EmergencyAccessLog> {
    const log: EmergencyAccessLog = {
      id: randomUUID(),
      ...data,
    };
    this.emergencyLogs.push(log);
    return log;
  }

  async getActiveAccessLog(patientRecordId: string): Promise<EmergencyAccessLog | undefined> {
    const now = new Date();
    return this.emergencyLogs.find(
      (log) => log.patientRecordId === patientRecordId && log.expiresAt > now
    );
  }
}

export const storage = new MemStorage();
