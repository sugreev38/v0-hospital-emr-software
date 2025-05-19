"use client"

import { openDB, type DBSchema, type IDBPDatabase } from "idb"

// Define the database schema
interface PatientRecord {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  contact: string
  address: string
  email: string
  emergencyContact: string
  bloodType: string
  allergies: string[]
  medicalConditions: string[]
  medications: string[]
  insuranceProvider: string
  insuranceNumber: string
  lastVisit: string
  status: "active" | "inactive" | "critical"
  notes: string
  createdAt: string
  updatedAt: string
}

interface MedicalRecord {
  id: string
  patientId: string
  type: "consultation" | "lab" | "imaging" | "prescription" | "other"
  date: string
  provider: string
  diagnosis: string
  treatment: string
  medications: string[]
  notes: string
  attachments: string[]
  status: "complete" | "pending" | "incomplete"
  createdAt: string
  updatedAt: string
}

interface Appointment {
  id: string
  patientId: string
  date: string
  time: string
  duration: string
  type: string
  mode: "in-person" | "video" | "phone"
  provider: string
  notes: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  createdAt: string
  updatedAt: string
}

interface SyncQueue {
  id: string
  operation: "create" | "update" | "delete"
  entity: "patient" | "record" | "appointment"
  data: any
  timestamp: number
  retries: number
  status: "pending" | "processing" | "failed"
}

interface HospitalEMRDB extends DBSchema {
  patients: {
    key: string
    value: PatientRecord
    indexes: {
      "by-name": string
      "by-status": string
      "by-last-visit": string
    }
  }
  medicalRecords: {
    key: string
    value: MedicalRecord
    indexes: {
      "by-patient": string
      "by-type": string
      "by-date": string
      "by-status": string
    }
  }
  appointments: {
    key: string
    value: Appointment
    indexes: {
      "by-patient": string
      "by-date": string
      "by-status": string
    }
  }
  syncQueue: {
    key: string
    value: SyncQueue
    indexes: {
      "by-status": string
      "by-timestamp": number
    }
  }
}

// Database version
const DB_VERSION = 1
const DB_NAME = "hospital-emr-db"

// Class to handle database operations
export class DBService {
  private db: Promise<IDBPDatabase<HospitalEMRDB>>
  private isOnline: boolean = navigator.onLine

  constructor() {
    this.db = this.initDB()

    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true
      this.processSyncQueue()
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
    })
  }

  private async initDB() {
    return openDB<HospitalEMRDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create patients store
        const patientStore = db.createObjectStore("patients", { keyPath: "id" })
        patientStore.createIndex("by-name", "name")
        patientStore.createIndex("by-status", "status")
        patientStore.createIndex("by-last-visit", "lastVisit")

        // Create medical records store
        const recordStore = db.createObjectStore("medicalRecords", { keyPath: "id" })
        recordStore.createIndex("by-patient", "patientId")
        recordStore.createIndex("by-type", "type")
        recordStore.createIndex("by-date", "date")
        recordStore.createIndex("by-status", "status")

        // Create appointments store
        const appointmentStore = db.createObjectStore("appointments", { keyPath: "id" })
        appointmentStore.createIndex("by-patient", "patientId")
        appointmentStore.createIndex("by-date", "date")
        appointmentStore.createIndex("by-status", "status")

        // Create sync queue store
        const syncQueueStore = db.createObjectStore("syncQueue", { keyPath: "id" })
        syncQueueStore.createIndex("by-status", "status")
        syncQueueStore.createIndex("by-timestamp", "timestamp")
      },
    })
  }

  // Patient methods
  async getPatients(): Promise<PatientRecord[]> {
    return (await this.db).getAll("patients")
  }

  async getPatientById(id: string): Promise<PatientRecord | undefined> {
    return (await this.db).get("patients", id)
  }

  async savePatient(patient: PatientRecord): Promise<string> {
    const timestamp = new Date().toISOString()

    if (!patient.id) {
      patient.id = `P${Date.now()}`
      patient.createdAt = timestamp
    }

    patient.updatedAt = timestamp

    await (await this.db).put("patients", patient)

    // Add to sync queue if offline
    if (!this.isOnline) {
      await this.addToSyncQueue("update", "patient", patient)
    }

    return patient.id
  }

  async deletePatient(id: string): Promise<void> {
    await (await this.db).delete("patients", id)

    // Add to sync queue if offline
    if (!this.isOnline) {
      await this.addToSyncQueue("delete", "patient", { id })
    }
  }

  // Medical record methods
  async getMedicalRecords(): Promise<MedicalRecord[]> {
    return (await this.db).getAll("medicalRecords")
  }

  async getMedicalRecordById(id: string): Promise<MedicalRecord | undefined> {
    return (await this.db).get("medicalRecords", id)
  }

  async getPatientMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    const index = (await this.db).transaction("medicalRecords").store.index("by-patient")
    return index.getAll(patientId)
  }

  async saveMedicalRecord(record: MedicalRecord): Promise<string> {
    const timestamp = new Date().toISOString()

    if (!record.id) {
      record.id = `R${Date.now()}`
      record.createdAt = timestamp
    }

    record.updatedAt = timestamp

    await (await this.db).put("medicalRecords", record)

    // Add to sync queue if offline
    if (!this.isOnline) {
      await this.addToSyncQueue("update", "record", record)
    }

    return record.id
  }

  async deleteMedicalRecord(id: string): Promise<void> {
    await (await this.db).delete("medicalRecords", id)

    // Add to sync queue if offline
    if (!this.isOnline) {
      await this.addToSyncQueue("delete", "record", { id })
    }
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return (await this.db).getAll("appointments")
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    return (await this.db).get("appointments", id)
  }

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    const index = (await this.db).transaction("appointments").store.index("by-patient")
    return index.getAll(patientId)
  }

  async saveAppointment(appointment: Appointment): Promise<string> {
    const timestamp = new Date().toISOString()

    if (!appointment.id) {
      appointment.id = `A${Date.now()}`
      appointment.createdAt = timestamp
    }

    appointment.updatedAt = timestamp

    await (await this.db).put("appointments", appointment)

    // Add to sync queue if offline
    if (!this.isOnline) {
      await this.addToSyncQueue("update", "appointment", appointment)
    }

    return appointment.id
  }

  async deleteAppointment(id: string): Promise<void> {
    await (await this.db).delete("appointments", id)

    // Add to sync queue if offline
    if (!this.isOnline) {
      await this.addToSyncQueue("delete", "appointment", { id })
    }
  }

  // Sync queue methods
  private async addToSyncQueue(
    operation: "create" | "update" | "delete",
    entity: "patient" | "record" | "appointment",
    data: any,
  ): Promise<void> {
    const syncItem: SyncQueue = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      operation,
      entity,
      data,
      timestamp: Date.now(),
      retries: 0,
      status: "pending",
    }

    await (await this.db).put("syncQueue", syncItem)
  }

  async processSyncQueue(): Promise<void> {
    if (!this.isOnline) return

    const db = await this.db
    const tx = db.transaction("syncQueue", "readwrite")
    const index = tx.store.index("by-status")

    let cursor = await index.openCursor("pending")

    while (cursor) {
      const syncItem = cursor.value

      // Mark as processing
      syncItem.status = "processing"
      await cursor.update(syncItem)

      try {
        // Here we would normally send the data to the server
        // For this example, we'll just simulate a successful sync
        console.log(`Syncing ${syncItem.entity} with operation ${syncItem.operation}`, syncItem.data)

        // If successful, delete from queue
        await cursor.delete()
      } catch (error) {
        // If failed, increment retry count and mark as failed if too many retries
        syncItem.retries += 1
        syncItem.status = syncItem.retries > 3 ? "failed" : "pending"
        await cursor.update(syncItem)
      }

      cursor = await cursor.continue()
    }

    await tx.done
  }

  // Get sync status
  async getSyncStatus(): Promise<{ pending: number; failed: number }> {
    const db = await this.db
    const pendingCount = await db.countFromIndex("syncQueue", "by-status", "pending")
    const failedCount = await db.countFromIndex("syncQueue", "by-status", "failed")

    return {
      pending: pendingCount,
      failed: failedCount,
    }
  }
}

// Create a singleton instance
let dbServiceInstance: DBService | null = null

export function getDBService(): DBService {
  if (!dbServiceInstance) {
    dbServiceInstance = new DBService()
  }
  return dbServiceInstance
}
