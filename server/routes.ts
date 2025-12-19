import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const simpleLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const simpleRegisterSchema = z.object({
  fullName: z.string().min(1),
  username: z.string().min(3),
  password: z.string().min(6),
  bloodType: z.string().nullable().optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = simpleRegisterSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const nftId = `NFT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const user = await storage.createSimpleUser({
        username: data.username,
        password: data.password,
        fullName: data.fullName,
        bloodType: data.bloodType || null,
        nftId,
      });

      res.status(201).json({
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          bloodType: user.bloodType,
          nftId: user.nftId,
        },
        message: "Registration successful",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", details: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = simpleLoginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(data.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      if (user.password !== data.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          bloodType: user.bloodType,
          nftId: user.nftId,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", details: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/patient/:nftId", async (req, res) => {
    try {
      const { nftId } = req.params;
      const patientRecord = await storage.getPatientRecordByNftId(nftId);
      
      if (!patientRecord) {
        return res.status(404).json({ error: "Patient record not found" });
      }
      
      res.json(patientRecord);
    } catch (error) {
      console.error("Error fetching patient record:", error);
      res.status(500).json({ error: "Failed to fetch patient record" });
    }
  });
  
  app.post("/api/emergency-access/log", async (req, res) => {
    try {
      const { patientRecordId, accessedBy, reason } = req.body;
      
      const accessLog = await storage.createEmergencyAccessLog({
        patientRecordId,
        accessedBy,
        reason,
        accessedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      });
      
      res.status(201).json(accessLog);
    } catch (error) {
      console.error("Error creating emergency access log:", error);
      res.status(500).json({ error: "Failed to log emergency access" });
    }
  });

  app.post("/api/hospital/login", async (req, res) => {
    try {
      const data = simpleLoginSchema.parse(req.body);
      const hospital = await storage.getHospitalByUsername(data.username);
      
      if (!hospital) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (hospital.password !== data.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({
        hospital: {
          id: hospital.id,
          username: hospital.username,
          hospitalName: hospital.hospitalName,
          address: hospital.address,
          contactNumber: hospital.contactNumber,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      console.error("Hospital login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/hospital/search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Search query required" });
      }

      const results = await storage.searchPatients(query);
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.post("/api/hospital/records", async (req, res) => {
    try {
      const { patientNftId, diagnosis, treatment, hospital, notes, hospitalId } = req.body;
      
      const hasAccess = await storage.checkAccessPermission(patientNftId, hospitalId);
      if (!hasAccess) {
        return res.status(403).json({ error: "No access permission for this patient" });
      }

      const updated = await storage.addRecordByHospital({
        patientNftId,
        diagnosis,
        treatment,
        hospital,
        notes,
      });

      if (!updated) {
        return res.status(404).json({ error: "Patient not found" });
      }

      res.status(201).json(updated);
    } catch (error) {
      console.error("Error adding record:", error);
      res.status(500).json({ error: "Failed to add record" });
    }
  });

  app.post("/api/hospital/grant-access", async (req, res) => {
    try {
      const { patientNftId, hospitalId, durationDays } = req.body;
      
      const permission = await storage.grantAccessPermission({
        patientNftId,
        hospitalId,
        durationDays: durationDays || 30,
      });

      res.status(201).json(permission);
    } catch (error) {
      console.error("Error granting access:", error);
      res.status(500).json({ error: "Failed to grant access" });
    }
  });

  return httpServer;
}
