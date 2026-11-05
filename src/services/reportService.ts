import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from '../firebase.ts';
import { Report } from '../types.ts';
import { INITIAL_SEED_REPORTS } from '../data/seedReports.ts';
import { validateResolutionCode } from '../utils/codeGenerator.ts';

const LOCAL_STORAGE_KEY = 'lpu_lost_found_reports_v2';
const REPORTS_COLLECTION = 'reports';

function getLocalReports(): Report[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read local reports:', e);
  }
  return INITIAL_SEED_REPORTS;
}

function saveLocalReports(reports: Report[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save local reports:', e);
  }
}

export class ReportService {
  private static listeners: ((reports: Report[]) => void)[] = [];
  private static currentReports: Report[] = getLocalReports();
  private static isConnectedToFirestore = false;
  private static hasInitialized = false;

  public static isConnected(): boolean {
    return this.isConnectedToFirestore;
  }

  public static initialize(): void {
    if (this.hasInitialized) return;
    this.hasInitialized = true;

    // Test Firestore connection
    testConnection().then((connected) => {
      this.isConnectedToFirestore = connected;
      if (connected) {
        this.setupFirestoreListener();
      } else {
        this.notifyListeners(this.currentReports);
      }
    }).catch(() => {
      this.isConnectedToFirestore = false;
      this.notifyListeners(this.currentReports);
    });
  }

  private static setupFirestoreListener(): void {
    try {
      const reportsQuery = query(collection(db, REPORTS_COLLECTION));
      
      onSnapshot(
        reportsQuery,
        (snapshot) => {
          this.isConnectedToFirestore = true;
          if (snapshot.empty) {
            // Seed initial records to Firestore so users immediately have items
            this.seedFirestore();
          } else {
            const firestoreReports: Report[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as Report;
              firestoreReports.push({ ...data, id: docSnap.id });
            });

            // Sort newest first
            firestoreReports.sort((a, b) => {
              const timeA = new Date(a.createdAt || 0).getTime();
              const timeB = new Date(b.createdAt || 0).getTime();
              return timeB - timeA;
            });

            this.currentReports = firestoreReports;
            saveLocalReports(firestoreReports);
            this.notifyListeners(this.currentReports);
          }
        },
        (error) => {
          console.warn('Firestore subscription notice, falling back to local storage:', error.message);
          this.isConnectedToFirestore = false;
          this.notifyListeners(this.currentReports);
          handleFirestoreError(error, OperationType.LIST, REPORTS_COLLECTION);
        }
      );
    } catch (e) {
      console.warn('Error starting Firestore listener:', e);
      this.isConnectedToFirestore = false;
      this.notifyListeners(this.currentReports);
    }
  }

  private static async seedFirestore(): Promise<void> {
    try {
      for (const item of INITIAL_SEED_REPORTS) {
        await setDoc(doc(db, REPORTS_COLLECTION, item.id), item);
      }
    } catch (e) {
      console.warn('Could not seed initial reports to Firestore:', e);
    }
  }

  public static subscribe(callback: (reports: Report[], connected: boolean) => void): () => void {
    const wrappedCallback = (reports: Report[]) => callback(reports, this.isConnectedToFirestore);
    this.listeners.push(wrappedCallback);
    
    // Initial call
    callback(this.currentReports, this.isConnectedToFirestore);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== wrappedCallback);
    };
  }

  private static notifyListeners(reports: Report[]): void {
    this.listeners.forEach((listener) => {
      try {
        listener(reports);
      } catch (err) {
        console.error('Error notifying report listener:', err);
      }
    });
  }

  public static async createReport(report: Report): Promise<void> {
    // 1. Update local cache immediately
    const updated = [report, ...this.currentReports.filter((r) => r.id !== report.id)];
    this.currentReports = updated;
    saveLocalReports(updated);
    this.notifyListeners(this.currentReports);

    // 2. Sync to Firestore if online
    try {
      await setDoc(doc(db, REPORTS_COLLECTION, report.id), report);
    } catch (error) {
      console.warn('Could not sync created report to Firestore (saved locally):', error);
      // We don't block the user, error handled gracefully
    }
  }

  public static async resolveReport(
    reportId: string,
    secretCodeInput: string,
    handoverNote?: string
  ): Promise<{ success: boolean; message: string }> {
    const target = this.currentReports.find((r) => r.id === reportId);
    if (!target) {
      return { success: false, message: 'Report not found in system.' };
    }

    if (target.status === 'resolved') {
      return { success: false, message: 'This item has already been marked as resolved.' };
    }

    // Validate the secret security code
    const isCodeValid = validateResolutionCode(secretCodeInput, target.secretCode);
    if (!isCodeValid) {
      return {
        success: false,
        message: 'Incorrect Resolution Code. Please check the code provided when the report was submitted.',
      };
    }

    const resolvedAt = new Date().toISOString();
    const resolvedByNote = handoverNote?.trim() || 'Item successfully returned and verified with security code.';

    // 1. Update local cache immediately
    const updated = this.currentReports.map((r) => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'resolved' as const,
          resolvedAt,
          resolvedByNote,
        };
      }
      return r;
    });

    this.currentReports = updated;
    saveLocalReports(updated);
    this.notifyListeners(this.currentReports);

    // 2. Sync to Firestore
    try {
      await updateDoc(doc(db, REPORTS_COLLECTION, reportId), {
        status: 'resolved',
        resolvedAt,
        resolvedByNote,
      });
    } catch (error) {
      console.warn('Firestore update failed (updated in local state):', error);
    }

    return {
      success: true,
      message: 'Report resolved successfully! The case is now closed.',
    };
  }
}
