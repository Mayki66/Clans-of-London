/**
 * Cryptographically Secure Admin Telemetry & Authentication Service
 * Clans of London
 */

const ADMIN_USER_HASH = "66de23131a05ab0d91d9d799aff7a0865fbda0857913c96a7848d7bdc79e9654";
const ADMIN_PASS_HASH = "94c08fe9d68ac10788bd923aca641cbf6158b32e2534333dc276fdd7bf43e1fe";

const LOCAL_STORAGE_TELEMETRY = "col_admin_telemetry_v1";

export async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminCredentials(username, password) {
  const uHash = await hashString(username.trim());
  const pHash = await hashString(password.trim());
  return uHash === ADMIN_USER_HASH && pHash === ADMIN_PASS_HASH;
}

export function getTelemetryData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TELEMETRY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading admin telemetry", e);
  }

  return {
    totalVisits: 1,
    totalInteractions: 0,
    totalProfileExports: 0,
    registeredUsers: [
      {
        pseudo: "Mayki",
        registeredAt: "2026-08-20",
        lastActive: "Aujourd'hui",
        level: 14,
        rank: "Ancilla de Soho",
        hasExported: true
      }
    ]
  };
}

export function saveTelemetryData(data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_TELEMETRY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving admin telemetry", e);
  }
}

export function trackVisit() {
  const data = getTelemetryData();
  data.totalVisits = (data.totalVisits || 0) + 1;
  saveTelemetryData(data);
}

export function trackInteraction() {
  const data = getTelemetryData();
  data.totalInteractions = (data.totalInteractions || 0) + 1;
  saveTelemetryData(data);
}

export function trackProfileExport(pseudo, level = 1, rank = "Néophyte") {
  const data = getTelemetryData();
  data.totalProfileExports = (data.totalProfileExports || 0) + 1;

  const existingIdx = data.registeredUsers.findIndex(u => u.pseudo.toLowerCase() === (pseudo || '').toLowerCase());
  const now = new Date().toISOString().split('T')[0];

  if (existingIdx >= 0) {
    data.registeredUsers[existingIdx] = {
      ...data.registeredUsers[existingIdx],
      lastActive: now,
      level,
      rank,
      hasExported: true
    };
  } else if (pseudo) {
    data.registeredUsers.push({
      pseudo,
      registeredAt: now,
      lastActive: now,
      level,
      rank,
      hasExported: true
    });
  }

  saveTelemetryData(data);
}

export function trackUserRegistration(pseudo, level = 1, rank = "Néophyte") {
  if (!pseudo) return;
  const data = getTelemetryData();
  const existingIdx = data.registeredUsers.findIndex(u => u.pseudo.toLowerCase() === pseudo.toLowerCase());
  const now = new Date().toISOString().split('T')[0];

  if (existingIdx >= 0) {
    data.registeredUsers[existingIdx].lastActive = now;
    data.registeredUsers[existingIdx].level = level;
  } else {
    data.registeredUsers.push({
      pseudo,
      registeredAt: now,
      lastActive: now,
      level,
      rank,
      hasExported: false
    });
  }

  saveTelemetryData(data);
}
