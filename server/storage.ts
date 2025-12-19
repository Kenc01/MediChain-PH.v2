import { randomUUID } from "crypto";

interface SimpleUser {
  id: string;
  username: string;
  password: string;
  fullName: string;
  bloodType: string | null;
  nftId: string;
}

interface HospitalUser {
  id: string;
  username: string;
  password: string;
  hospitalName: string;
  address: string;
  contactNumber: string;
}

interface AccessPermission {
  id: string;
  patientNftId: string;
  hospitalId: string;
  expiresAt: Date;
  status: string;
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
  private hospitalUsers: Map<string, HospitalUser> = new Map();
  private patientRecords: Map<string, PatientRecord> = new Map();
  private emergencyLogs: EmergencyAccessLog[] = [];
  private accessPermissions: AccessPermission[] = [];

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    const demoNftId = "NFT-DEMO-001";
    
    const demoUser: SimpleUser = {
      id: randomUUID(),
      username: "maria",
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

    // Add demo hospital users
    const demoHospital: HospitalUser = {
      id: randomUUID(),
      username: "hospital",
      password: "hospital123",
      hospitalName: "Philippine General Hospital",
      address: "Taft Avenue, Manila",
      contactNumber: "+63 2 554 8000",
    };
    this.hospitalUsers.set(demoHospital.id, demoHospital);

    // Add demo user juan
    const juan: SimpleUser = {
      id: randomUUID(),
      username: "juan",
      password: "demo123",
      fullName: "Juan Dela Cruz",
      bloodType: "A+",
      nftId: "NFT-DEMO-002",
    };
    this.users.set(juan.id, juan);

    const juanRecord: PatientRecord = {
      id: randomUUID(),
      nftId: "NFT-DEMO-002",
      patientName: "Juan Dela Cruz",
      bloodType: "A+",
      allergies: ["Sulfonamides"],
      medications: ["Aspirin 81mg"],
      emergencyContacts: [
        {
          name: "Maria Dela Cruz",
          relationship: "Wife",
          phone: "+63 917 456 7890",
        },
      ],
      medicalRecords: [
        {
          date: "2024-12-01",
          diagnosis: "Heart Checkup",
          treatment: "Continue medication, regular exercise",
          hospital: "St. Luke's Medical Center",
          notes: "ECG normal",
        },
      ],
    };
    this.patientRecords.set(juanRecord.nftId, juanRecord);
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

  async getHospitalByUsername(username: string): Promise<HospitalUser | undefined> {
    for (const hospital of this.hospitalUsers.values()) {
      if (hospital.username === username) {
        return hospital;
      }
    }
    return undefined;
  }

  async searchPatients(query: string): Promise<PatientRecord[]> {
    const lowerQuery = query.toLowerCase();
    const results: PatientRecord[] = [];
    
    for (const record of this.patientRecords.values()) {
      if (
        record.patientName.toLowerCase().includes(lowerQuery) ||
        record.nftId.toLowerCase().includes(lowerQuery)
      ) {
        results.push(record);
      }
    }
    return results;
  }

  async grantAccessPermission(data: {
    patientNftId: string;
    hospitalId: string;
    durationDays: number;
  }): Promise<AccessPermission> {
    const permission: AccessPermission = {
      id: randomUUID(),
      patientNftId: data.patientNftId,
      hospitalId: data.hospitalId,
      expiresAt: new Date(Date.now() + data.durationDays * 24 * 60 * 60 * 1000),
      status: "active",
    };
    this.accessPermissions.push(permission);
    return permission;
  }

  async checkAccessPermission(patientNftId: string, hospitalId: string): Promise<boolean> {
    const now = new Date();
    return this.accessPermissions.some(
      (p) => p.patientNftId === patientNftId && 
             p.hospitalId === hospitalId && 
             p.expiresAt > now && 
             p.status === "active"
    );
  }

  async addRecordByHospital(data: {
    patientNftId: string;
    diagnosis: string;
    treatment: string;
    hospital: string;
    notes?: string;
  }): Promise<PatientRecord | null> {
    const record = this.patientRecords.get(data.patientNftId);
    if (!record) return null;

    const newMedicalRecord = {
      date: new Date().toISOString().split("T")[0],
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      hospital: data.hospital,
      notes: data.notes,
    };

    record.medicalRecords.push(newMedicalRecord);
    return record;
  }
}

export const storage = new MemStorage();
