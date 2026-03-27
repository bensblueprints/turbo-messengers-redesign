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

// ============================================
// LEADS MANAGEMENT
// ============================================

export interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  service_type?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  source: string;
  assigned_to?: number;
  converted_to_client_id?: number;
  created_at: string;
  updated_at: string;
  contacted_at?: string;
  notes?: string;
}

export async function getAllLeads(): Promise<Lead[]> {
  const result = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
  return result as Lead[];
}

export async function getLeadById(id: number): Promise<Lead | null> {
  const result = await sql`SELECT * FROM leads WHERE id = ${id}`;
  return result[0] as Lead || null;
}

export async function createLead(data: Partial<Lead>): Promise<Lead> {
  const result = await sql`
    INSERT INTO leads (name, email, phone, company, service_type, message, source, status)
    VALUES (
      ${data.name},
      ${data.email || null},
      ${data.phone || null},
      ${data.company || null},
      ${data.service_type || null},
      ${data.message || null},
      ${data.source || 'website'},
      ${data.status || 'new'}
    )
    RETURNING *
  `;
  return result[0] as Lead;
}

export async function updateLead(id: number, data: Partial<Lead>): Promise<Lead | null> {
  const result = await sql`
    UPDATE leads
    SET
      name = COALESCE(${data.name || null}, name),
      email = COALESCE(${data.email || null}, email),
      phone = COALESCE(${data.phone || null}, phone),
      company = COALESCE(${data.company || null}, company),
      service_type = COALESCE(${data.service_type || null}, service_type),
      message = COALESCE(${data.message || null}, message),
      status = COALESCE(${data.status || null}, status),
      notes = COALESCE(${data.notes || null}, notes),
      assigned_to = COALESCE(${data.assigned_to || null}, assigned_to),
      contacted_at = CASE WHEN ${data.status} = 'contacted' AND contacted_at IS NULL THEN NOW() ELSE contacted_at END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as Lead || null;
}

export async function convertLeadToClient(leadId: number, clientId: number): Promise<void> {
  await sql`
    UPDATE leads
    SET status = 'converted', converted_to_client_id = ${clientId}, updated_at = NOW()
    WHERE id = ${leadId}
  `;
}

export async function getLeadsByStatus(status: string): Promise<Lead[]> {
  const result = await sql`SELECT * FROM leads WHERE status = ${status} ORDER BY created_at DESC`;
  return result as Lead[];
}

// ============================================
// SERVICES MANAGEMENT
// ============================================

export interface Service {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price_range?: string;
  base_price?: number;
  turnaround_time?: string;
  is_active: boolean;
  display_order: number;
  features?: string[];
  created_at: string;
  updated_at: string;
}

export async function getAllServices(): Promise<Service[]> {
  const result = await sql`SELECT * FROM services ORDER BY display_order, name`;
  return result as Service[];
}

export async function getActiveServices(): Promise<Service[]> {
  const result = await sql`SELECT * FROM services WHERE is_active = true ORDER BY display_order, name`;
  return result as Service[];
}

export async function getServiceById(id: number): Promise<Service | null> {
  const result = await sql`SELECT * FROM services WHERE id = ${id}`;
  return result[0] as Service || null;
}

export async function createService(data: Partial<Service>): Promise<Service> {
  const result = await sql`
    INSERT INTO services (name, slug, description, price_range, base_price, turnaround_time, features, display_order, is_active)
    VALUES (
      ${data.name},
      ${data.slug},
      ${data.description || null},
      ${data.price_range || null},
      ${data.base_price || null},
      ${data.turnaround_time || null},
      ${JSON.stringify(data.features || [])},
      ${data.display_order || 0},
      ${data.is_active !== undefined ? data.is_active : true}
    )
    RETURNING *
  `;
  return result[0] as Service;
}

export async function updateService(id: number, data: Partial<Service>): Promise<Service | null> {
  const result = await sql`
    UPDATE services
    SET
      name = COALESCE(${data.name || null}, name),
      slug = COALESCE(${data.slug || null}, slug),
      description = COALESCE(${data.description || null}, description),
      price_range = COALESCE(${data.price_range || null}, price_range),
      base_price = COALESCE(${data.base_price || null}, base_price),
      turnaround_time = COALESCE(${data.turnaround_time || null}, turnaround_time),
      features = COALESCE(${data.features ? JSON.stringify(data.features) : null}, features),
      display_order = COALESCE(${data.display_order !== undefined ? data.display_order : null}, display_order),
      is_active = COALESCE(${data.is_active !== undefined ? data.is_active : null}, is_active),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as Service || null;
}

export async function deleteService(id: number): Promise<void> {
  await sql`DELETE FROM services WHERE id = ${id}`;
}

// ============================================
// COUNTIES MANAGEMENT
// ============================================

export interface County {
  id: number;
  name: string;
  state: string;
  is_active: boolean;
  rush_available: boolean;
  rush_fee?: number;
  standard_turnaround?: string;
  rush_turnaround?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export async function getAllCounties(): Promise<County[]> {
  const result = await sql`SELECT * FROM counties ORDER BY state, name`;
  return result as County[];
}

export async function getActiveCounties(): Promise<County[]> {
  const result = await sql`SELECT * FROM counties WHERE is_active = true ORDER BY state, name`;
  return result as County[];
}

export async function getCountyById(id: number): Promise<County | null> {
  const result = await sql`SELECT * FROM counties WHERE id = ${id}`;
  return result[0] as County || null;
}

export async function createCounty(data: Partial<County>): Promise<County> {
  const result = await sql`
    INSERT INTO counties (name, state, is_active, rush_available, rush_fee, standard_turnaround, rush_turnaround, notes)
    VALUES (
      ${data.name},
      ${data.state || 'CA'},
      ${data.is_active !== undefined ? data.is_active : true},
      ${data.rush_available !== undefined ? data.rush_available : true},
      ${data.rush_fee || 50.00},
      ${data.standard_turnaround || '3-5 business days'},
      ${data.rush_turnaround || 'Same day / 24 hours'},
      ${data.notes || null}
    )
    RETURNING *
  `;
  return result[0] as County;
}

export async function updateCounty(id: number, data: Partial<County>): Promise<County | null> {
  const result = await sql`
    UPDATE counties
    SET
      name = COALESCE(${data.name || null}, name),
      state = COALESCE(${data.state || null}, state),
      is_active = COALESCE(${data.is_active !== undefined ? data.is_active : null}, is_active),
      rush_available = COALESCE(${data.rush_available !== undefined ? data.rush_available : null}, rush_available),
      rush_fee = COALESCE(${data.rush_fee || null}, rush_fee),
      standard_turnaround = COALESCE(${data.standard_turnaround || null}, standard_turnaround),
      rush_turnaround = COALESCE(${data.rush_turnaround || null}, rush_turnaround),
      notes = COALESCE(${data.notes || null}, notes),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as County || null;
}

export async function deleteCounty(id: number): Promise<void> {
  await sql`DELETE FROM counties WHERE id = ${id}`;
}

// ============================================
// TESTIMONIALS MANAGEMENT
// ============================================

export interface Testimonial {
  id: number;
  name: string;
  company?: string;
  content: string;
  rating: number;
  is_featured: boolean;
  is_published: boolean;
  service_type?: string;
  created_at: string;
  updated_at: string;
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const result = await sql`SELECT * FROM testimonials ORDER BY created_at DESC`;
  return result as Testimonial[];
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const result = await sql`SELECT * FROM testimonials WHERE is_published = true ORDER BY is_featured DESC, created_at DESC`;
  return result as Testimonial[];
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const result = await sql`SELECT * FROM testimonials WHERE is_published = true AND is_featured = true ORDER BY created_at DESC LIMIT 6`;
  return result as Testimonial[];
}

export async function getTestimonialById(id: number): Promise<Testimonial | null> {
  const result = await sql`SELECT * FROM testimonials WHERE id = ${id}`;
  return result[0] as Testimonial || null;
}

export async function createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
  const result = await sql`
    INSERT INTO testimonials (name, company, content, rating, is_featured, is_published, service_type)
    VALUES (
      ${data.name},
      ${data.company || null},
      ${data.content},
      ${data.rating || 5},
      ${data.is_featured || false},
      ${data.is_published !== undefined ? data.is_published : true},
      ${data.service_type || null}
    )
    RETURNING *
  `;
  return result[0] as Testimonial;
}

export async function updateTestimonial(id: number, data: Partial<Testimonial>): Promise<Testimonial | null> {
  const result = await sql`
    UPDATE testimonials
    SET
      name = COALESCE(${data.name || null}, name),
      company = COALESCE(${data.company || null}, company),
      content = COALESCE(${data.content || null}, content),
      rating = COALESCE(${data.rating || null}, rating),
      is_featured = COALESCE(${data.is_featured !== undefined ? data.is_featured : null}, is_featured),
      is_published = COALESCE(${data.is_published !== undefined ? data.is_published : null}, is_published),
      service_type = COALESCE(${data.service_type || null}, service_type),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as Testimonial || null;
}

export async function deleteTestimonial(id: number): Promise<void> {
  await sql`DELETE FROM testimonials WHERE id = ${id}`;
}

// ============================================
// JOB ATTEMPTS MANAGEMENT
// ============================================

export interface JobAttempt {
  id: number;
  job_id: number;
  attempt_number: number;
  attempt_date: string;
  result: string;
  notes?: string;
  server_name?: string;
  gps_location?: string;
  photos_urls?: string[];
  created_at: string;
}

export async function getJobAttempts(jobId: number): Promise<JobAttempt[]> {
  const result = await sql`SELECT * FROM job_attempts WHERE job_id = ${jobId} ORDER BY attempt_number`;
  return result as JobAttempt[];
}

export async function createJobAttempt(data: Partial<JobAttempt>): Promise<JobAttempt> {
  const result = await sql`
    INSERT INTO job_attempts (job_id, attempt_number, attempt_date, result, notes, server_name, gps_location, photos_urls)
    VALUES (
      ${data.job_id},
      ${data.attempt_number || 1},
      ${data.attempt_date || new Date().toISOString()},
      ${data.result},
      ${data.notes || null},
      ${data.server_name || null},
      ${data.gps_location || null},
      ${data.photos_urls ? JSON.stringify(data.photos_urls) : null}
    )
    RETURNING *
  `;
  return result[0] as JobAttempt;
}

// ============================================
// SITE SETTINGS MANAGEMENT
// ============================================

export interface SiteSetting {
  id: number;
  setting_key: string;
  setting_value?: string;
  setting_type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export async function getAllSettings(): Promise<SiteSetting[]> {
  const result = await sql`SELECT * FROM site_settings ORDER BY setting_key`;
  return result as SiteSetting[];
}

export async function getSettingByKey(key: string): Promise<SiteSetting | null> {
  const result = await sql`SELECT * FROM site_settings WHERE setting_key = ${key}`;
  return result[0] as SiteSetting || null;
}

export async function updateSetting(key: string, value: string): Promise<SiteSetting | null> {
  const result = await sql`
    UPDATE site_settings
    SET setting_value = ${value}, updated_at = NOW()
    WHERE setting_key = ${key}
    RETURNING *
  `;
  return result[0] as SiteSetting || null;
}

export async function createSetting(key: string, value: string, type: string = 'text', description?: string): Promise<SiteSetting> {
  const result = await sql`
    INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
    VALUES (${key}, ${value}, ${type}, ${description || null})
    ON CONFLICT (setting_key) DO UPDATE SET setting_value = ${value}, updated_at = NOW()
    RETURNING *
  `;
  return result[0] as SiteSetting;
}

// ============================================
// EXTENDED DATABASE INITIALIZATION
// ============================================

export async function initExtendedTables() {
  // This would run the migration SQL
  // For now, migrations should be run manually or via deployment script
  console.log('Extended tables should be initialized via migration file');
}
