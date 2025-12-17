# MediChain-PH

## Overview

MediChain-PH is a simplified healthcare records management platform designed for the Philippines, created as a thesis demonstration project. The application showcases how patients can own and control their medical data through NFT-based records, with a focus on emergency access functionality.

This is a **thesis demo version** focusing on the patient portal and emergency QR access features. Doctor and hospital portals are deferred as "future work" in the thesis documentation.

## Demo Credentials

**Patient Login:**
- Username: `maria` / Password: `demo123`
- Username: `juan` / Password: `demo123`

**Emergency Access NFT IDs:**
- `NFT-DEMO-001` - Maria Santos (Adult patient with medications)
- `NFT-DEMO-002` - Juan Dela Cruz (Patient record)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: Vue.js 3 with TypeScript, Vite as build tool, Vue Router for SPA routing.

**State Management**: Pinia for global state, TanStack Vue Query for server state and caching.

**Key Pages**:
- `/` - Landing page with "Thesis Demo Version" badge
- `/login` - Patient login
- `/register` - Patient registration
- `/dashboard` - Patient dashboard with medical records
- `/emergency` - Emergency access entry (QR scan or manual NFT ID)
- `/emergency/:nftId` - Emergency view showing critical patient info

**Styling**: Tailwind CSS with custom medical/healthcare theme colors.

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Endpoints**:
- `POST /api/auth/login` - Patient authentication
- `POST /api/auth/register` - New patient registration
- `GET /api/patient/:nftId` - Retrieve patient record by NFT ID
- `POST /api/emergency-access/log` - Log emergency access attempt

### Data Storage

**In-Memory Storage**: Uses `MemStorage` class with pre-seeded demo data for consistent demonstrations. This ensures the same patient data (Maria Santos) is available every time the app restarts.

**Demo Patient Data** (NFT-DEMO-001):
- Name: Maria Santos
- Blood Type: O+
- Allergies: Penicillin, Shellfish
- Medications: Metformin 500mg, Lisinopril 10mg
- Emergency Contacts: Juan Santos (Spouse), Dr. Ana Reyes (Primary Physician)

### Key Features for Thesis

1. **Patient Data Ownership**: Demonstrates the concept of patients owning their medical records via NFT IDs
2. **Emergency Access**: Shows how first responders can quickly access critical patient information via QR code
3. **Access Logging**: All emergency accesses are logged with timestamps and IP addresses
4. **Mobile-Friendly**: Responsive design optimized for demonstration on various devices

### Patient Portal Components (December 2024)

**PatientProfile.vue**: Displays patient information including:
- Profile card with name, age, contact info, and NFT ID
- Blood type display (critical emergency info)
- Allergies list with visual badges
- Current medications list
- Emergency contacts with phone links
- QR code generation for emergency access (using qrcode.vue)

**EmergencyToggle.vue**: Emergency mode activation system:
- Big red "Activate Emergency Mode" button
- Confirmation modal with optional access code
- 24-hour countdown timer when active
- Auto-generated or custom emergency access code
- Persistent state across page reloads (localStorage)
- Warning banner when emergency mode is active

**MedicalRecordsList.vue**: Medical records management:
- Search functionality across all records
- Filter by record type (Consultation, Laboratory, Prescription, Vaccination, Procedure)
- Expandable record cards with blockchain verification status
- Hospital visit history timeline
- Color-coded record types with icons

**Pinia Patient Store**: State management for patient data:
- Emergency mode state with expiry tracking
- Patient profile caching
- Emergency code generation and persistence

### Running the Project

The workflow named 'Start application' runs `npm run dev` which starts:
- Express backend server on port 5000
- Vite dev server for Vue.js frontend (HMR enabled)

### Project Structure

```
client/
  src/
    views/           # Page components (Login, Register, Dashboard, Emergency)
    components/
      patient/       # Patient portal components
        PatientProfile.vue      # Patient info + QR code
        EmergencyToggle.vue     # Emergency mode control
        MedicalRecordsList.vue  # Medical records with filtering
    router/          # Vue Router configuration
    stores/
      patientStore.ts  # Pinia store for patient state
    lib/             # Utilities and API client
    styles/          # Global CSS and theme
server/
  routes.ts          # API endpoints
  storage.ts         # In-memory data storage with demo data
  index.ts           # Server entry point
shared/
  schema.ts          # Data types and validation schemas
  mockData.ts        # Mock Philippine healthcare data
```
