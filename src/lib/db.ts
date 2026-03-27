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

// Voice Agent Conversations
export interface VoiceConversation {
  id: number;
  conversation_id: string; // ElevenLabs conversation ID
  caller_type: 'new_client' | 'existing_client';
  caller_name?: string;
  caller_email?: string;
  caller_phone?: string;
  caller_company?: string;
  existing_client_id?: number;
  intent?: string;
  summary?: string;
  transcript?: string;
  status: 'active' | 'completed' | 'failed';
  duration_seconds?: number;
  created_at: string;
  completed_at?: string;
}

export interface VoiceServiceRequest {
  id: number;
  conversation_id: number;
  client_id?: number;
  service_type: 'process_service' | 'court_filing' | 'small_claims' | 'document_retrieval' | 'status_inquiry' | 'general_inquiry';
  defendant_name?: string;
  defendant_address?: string;
  defendant_city?: string;
  defendant_state?: string;
  defendant_zip?: string;
  case_number?: string;
  court_name?: string;
  county?: string;
  rush_service: boolean;
  special_instructions?: string;
  callback_requested: boolean;
  callback_number?: string;
  status: 'pending_review' | 'converted_to_job' | 'requires_followup' | 'closed';
  job_id?: number;
  created_at: string;
}

// Initialize voice agent tables
export async function initVoiceAgentTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS voice_conversations (
      id SERIAL PRIMARY KEY,
      conversation_id TEXT UNIQUE NOT NULL,
      caller_type TEXT DEFAULT 'new_client',
      caller_name TEXT,
      caller_email TEXT,
      caller_phone TEXT,
      caller_company TEXT,
      existing_client_id INTEGER REFERENCES users(id),
      intent TEXT,
      summary TEXT,
      transcript TEXT,
      status TEXT DEFAULT 'active',
      duration_seconds INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS voice_service_requests (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER REFERENCES voice_conversations(id),
      client_id INTEGER REFERENCES users(id),
      service_type TEXT NOT NULL,
      defendant_name TEXT,
      defendant_address TEXT,
      defendant_city TEXT,
      defendant_state TEXT,
      defendant_zip TEXT,
      case_number TEXT,
      court_name TEXT,
      county TEXT,
      rush_service BOOLEAN DEFAULT FALSE,
      special_instructions TEXT,
      callback_requested BOOLEAN DEFAULT FALSE,
      callback_number TEXT,
      status TEXT DEFAULT 'pending_review',
      job_id INTEGER REFERENCES jobs(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_voice_conversations_status ON voice_conversations(status)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_voice_service_requests_status ON voice_service_requests(status)
  `;
}

// Voice conversation functions
export async function createVoiceConversation(conversationId: string, callerType: string = 'new_client'): Promise<VoiceConversation> {
  const result = await sql`
    INSERT INTO voice_conversations (conversation_id, caller_type)
    VALUES (${conversationId}, ${callerType})
    ON CONFLICT (conversation_id) DO UPDATE SET caller_type = ${callerType}
    RETURNING *
  `;
  return result[0] as VoiceConversation;
}

export async function getVoiceConversationByElevenLabsId(conversationId: string): Promise<VoiceConversation | null> {
  const result = await sql`SELECT * FROM voice_conversations WHERE conversation_id = ${conversationId}`;
  return result[0] as VoiceConversation || null;
}

export async function updateVoiceConversation(
  conversationId: string,
  data: Partial<VoiceConversation>
): Promise<VoiceConversation | null> {
  const result = await sql`
    UPDATE voice_conversations
    SET
      caller_name = COALESCE(${data.caller_name || null}, caller_name),
      caller_email = COALESCE(${data.caller_email || null}, caller_email),
      caller_phone = COALESCE(${data.caller_phone || null}, caller_phone),
      caller_company = COALESCE(${data.caller_company || null}, caller_company),
      existing_client_id = COALESCE(${data.existing_client_id || null}, existing_client_id),
      intent = COALESCE(${data.intent || null}, intent),
      summary = COALESCE(${data.summary || null}, summary),
      transcript = COALESCE(${data.transcript || null}, transcript),
      status = COALESCE(${data.status || null}, status),
      duration_seconds = COALESCE(${data.duration_seconds || null}, duration_seconds),
      completed_at = CASE WHEN ${data.status} = 'completed' THEN NOW() ELSE completed_at END
    WHERE conversation_id = ${conversationId}
    RETURNING *
  `;
  return result[0] as VoiceConversation || null;
}

export async function createVoiceServiceRequest(
  conversationDbId: number,
  data: Partial<VoiceServiceRequest>
): Promise<VoiceServiceRequest> {
  const result = await sql`
    INSERT INTO voice_service_requests (
      conversation_id, client_id, service_type, defendant_name, defendant_address,
      defendant_city, defendant_state, defendant_zip, case_number, court_name,
      county, rush_service, special_instructions, callback_requested, callback_number
    )
    VALUES (
      ${conversationDbId}, ${data.client_id || null}, ${data.service_type || 'general_inquiry'},
      ${data.defendant_name || null}, ${data.defendant_address || null},
      ${data.defendant_city || null}, ${data.defendant_state || null}, ${data.defendant_zip || null},
      ${data.case_number || null}, ${data.court_name || null}, ${data.county || null},
      ${data.rush_service || false}, ${data.special_instructions || null},
      ${data.callback_requested || false}, ${data.callback_number || null}
    )
    RETURNING *
  `;
  return result[0] as VoiceServiceRequest;
}

export async function getAllVoiceConversations(): Promise<VoiceConversation[]> {
  const result = await sql`SELECT * FROM voice_conversations ORDER BY created_at DESC`;
  return result as VoiceConversation[];
}

export async function getVoiceServiceRequestsByConversation(conversationId: number): Promise<VoiceServiceRequest[]> {
  const result = await sql`SELECT * FROM voice_service_requests WHERE conversation_id = ${conversationId}`;
  return result as VoiceServiceRequest[];
}

export async function getPendingVoiceServiceRequests(): Promise<VoiceServiceRequest[]> {
  const result = await sql`
    SELECT vsr.*, vc.caller_name, vc.caller_phone, vc.caller_email, vc.caller_company
    FROM voice_service_requests vsr
    JOIN voice_conversations vc ON vsr.conversation_id = vc.id
    WHERE vsr.status = 'pending_review'
    ORDER BY vsr.created_at DESC
  `;
  return result as VoiceServiceRequest[];
}

export async function convertServiceRequestToJob(requestId: number, clientId: number): Promise<Job> {
  // Get the service request
  const requestResult = await sql`SELECT * FROM voice_service_requests WHERE id = ${requestId}`;
  const request = requestResult[0] as VoiceServiceRequest;

  if (!request) {
    throw new Error('Service request not found');
  }

  // Create the job
  const jobResult = await sql`
    INSERT INTO jobs (client_id, job_type, defendant_name, defendant_address, court_name, case_number, notes, rush_service)
    VALUES (
      ${clientId},
      ${request.service_type === 'status_inquiry' || request.service_type === 'general_inquiry' ? 'process_service' : request.service_type},
      ${request.defendant_name || null},
      ${request.defendant_address ? `${request.defendant_address}, ${request.defendant_city || ''} ${request.defendant_state || ''} ${request.defendant_zip || ''}`.trim() : null},
      ${request.court_name || null},
      ${request.case_number || null},
      ${request.special_instructions || null},
      ${request.rush_service || false}
    )
    RETURNING *
  `;
  const job = jobResult[0] as Job;

  // Update the service request
  await sql`
    UPDATE voice_service_requests
    SET status = 'converted_to_job', job_id = ${job.id}
    WHERE id = ${requestId}
  `;

  return job;
}

export async function lookupClientByPhone(phone: string): Promise<User | null> {
  // Normalize phone number (remove non-digits)
  const normalizedPhone = phone.replace(/\D/g, '');
  const result = await sql`
    SELECT * FROM users
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(phone, '-', ''), '(', ''), ')', ''), ' ', '') LIKE ${'%' + normalizedPhone.slice(-10)}
    AND role = 'client'
    LIMIT 1
  `;
  return result[0] as User || null;
}

export async function lookupClientByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users
    WHERE LOWER(email) = LOWER(${email})
    AND role = 'client'
    LIMIT 1
  `;
  return result[0] as User || null;
}

export async function getClientJobHistory(clientId: number): Promise<Job[]> {
  const result = await sql`
    SELECT * FROM jobs
    WHERE client_id = ${clientId}
    ORDER BY created_at DESC
    LIMIT 10
  `;
  return result as Job[];
}
