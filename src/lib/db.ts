import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export { sql };

export type UserRole = 'client' | 'admin';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  company_name?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Job {
  id: number;
  client_id: number;
  job_type: 'process_service' | 'court_filing' | 'small_claims' | 'document_retrieval';
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  defendant_name?: string;
  defendant_address?: string;
  court_name?: string;
  case_number?: string;
  notes?: string;
  rush_service: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  assigned_to?: number;
  proof_of_service_url?: string;
}

// Initialize database tables
export async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      company_name TEXT,
      phone TEXT,
      role TEXT DEFAULT 'client',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES users(id),
      job_type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      defendant_name TEXT,
      defendant_address TEXT,
      court_name TEXT,
      case_number TEXT,
      notes TEXT,
      rush_service BOOLEAN DEFAULT FALSE,
      proof_of_service_url TEXT,
      assigned_to INTEGER REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      job_id INTEGER REFERENCES jobs(id),
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT,
      uploaded_by INTEGER REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

// User functions
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  return result[0] as User || null;
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await sql`SELECT * FROM users WHERE id = ${id}`;
  return result[0] as User || null;
}

export async function createUser(email: string, passwordHash: string, fullName: string, companyName?: string, phone?: string, role: UserRole = 'client'): Promise<User> {
  const result = await sql`
    INSERT INTO users (email, password_hash, full_name, company_name, phone, role)
    VALUES (${email}, ${passwordHash}, ${fullName}, ${companyName || null}, ${phone || null}, ${role})
    RETURNING *
  `;
  return result[0] as User;
}

// Job functions
export async function getJobsByClientId(clientId: number): Promise<Job[]> {
  const result = await sql`SELECT * FROM jobs WHERE client_id = ${clientId} ORDER BY created_at DESC`;
  return result as Job[];
}

export async function getAllJobs(): Promise<Job[]> {
  const result = await sql`SELECT * FROM jobs ORDER BY created_at DESC`;
  return result as Job[];
}

export async function getJobById(id: number): Promise<Job | null> {
  const result = await sql`SELECT * FROM jobs WHERE id = ${id}`;
  return result[0] as Job || null;
}

export async function createJob(job: Partial<Job>): Promise<Job> {
  const result = await sql`
    INSERT INTO jobs (client_id, job_type, defendant_name, defendant_address, court_name, case_number, notes, rush_service)
    VALUES (${job.client_id}, ${job.job_type}, ${job.defendant_name || null}, ${job.defendant_address || null}, ${job.court_name || null}, ${job.case_number || null}, ${job.notes || null}, ${job.rush_service || false})
    RETURNING *
  `;
  return result[0] as Job;
}

export async function updateJobStatus(id: number, status: string): Promise<Job | null> {
  const result = await sql`
    UPDATE jobs SET status = ${status}, updated_at = NOW() WHERE id = ${id} RETURNING *
  `;
  return result[0] as Job || null;
}

export async function getAllClients(): Promise<User[]> {
  const result = await sql`SELECT * FROM users WHERE role = 'client' ORDER BY created_at DESC`;
  return result as User[];
}
