-- Extended tables for Turbo Messengers Admin Dashboard
-- Migration created: 2026-03-27

-- Leads table (new client inquiries from website/voice agent)
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  service_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',  -- new, contacted, qualified, converted, closed
  source TEXT DEFAULT 'website',  -- website, phone, referral, voice_agent
  assigned_to INTEGER REFERENCES users(id),
  converted_to_client_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  notes TEXT
);

-- Services table (manage service offerings)
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_range TEXT,  -- e.g., "$95-$150"
  base_price DECIMAL(10, 2),
  turnaround_time TEXT,  -- e.g., "24-48 hours"
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  features JSONB,  -- array of feature strings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Counties table (service coverage areas)
CREATE TABLE IF NOT EXISTS counties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT DEFAULT 'CA',
  is_active BOOLEAN DEFAULT TRUE,
  rush_available BOOLEAN DEFAULT TRUE,
  rush_fee DECIMAL(10, 2) DEFAULT 50.00,
  standard_turnaround TEXT DEFAULT '3-5 business days',
  rush_turnaround TEXT DEFAULT 'Same day / 24 hours',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table (client reviews)
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  service_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Attempts table (track service attempts)
CREATE TABLE IF NOT EXISTS job_attempts (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  attempt_date TIMESTAMPTZ DEFAULT NOW(),
  result TEXT NOT NULL,  -- successful, no_answer, not_home, refused, address_issue, etc.
  notes TEXT,
  server_name TEXT,  -- name of process server
  gps_location TEXT,  -- lat,long
  photos_urls JSONB,  -- array of photo URLs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings table (global configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text',  -- text, number, boolean, json
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_counties_active ON counties(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_job_attempts_job_id ON job_attempts(job_id);

-- Insert default services
INSERT INTO services (name, slug, description, price_range, base_price, turnaround_time, features, display_order, is_active) VALUES
('Process Service', 'process-service', 'Professional service of summons, subpoenas, complaints, and other legal documents', '$95-$150', 95.00, '3-5 business days', '["Statewide coverage", "GPS tracking", "Photo documentation", "Affidavit of service", "Court filing available"]', 1, true),
('Court Filing', 'court-filing', 'Professional court filing services for all Southern California courts', '$75-$125', 75.00, '24-48 hours', ["Same-day filing available", "All SoCal courts", "Document preparation", "Filing confirmation", "Copy service"]', 2, true),
('Small Claims', 'small-claims', 'Complete small claims document preparation and filing assistance', '$125-$200', 125.00, '24-48 hours', '["Document preparation", "Filing assistance", "Court appearance support", "Collection assistance"]', 3, true),
('Document Retrieval', 'document-retrieval', 'Fast retrieval of court documents and public records', '$65-$150', 65.00, '24-72 hours', '["Court documents", "Public records", "Certified copies", "Rush service available"]', 4, true),
('Skip Tracing', 'skip-tracing', 'Professional skip tracing and locate services', '$150-$300', 150.00, '3-7 business days', '["Database searches", "Field investigation", "Social media research", "Asset searches"]', 5, true),
('Notary Services', 'notary-services', 'Mobile notary public services available statewide', '$50-$100', 50.00, 'Same day', '["Mobile service", "After-hours available", "Apostille service", "Translation notarization"]', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default counties
INSERT INTO counties (name, state, is_active, rush_available) VALUES
('Los Angeles', 'CA', true, true),
('Orange', 'CA', true, true),
('Ventura', 'CA', true, true),
('San Bernardino', 'CA', true, true),
('Riverside', 'CA', true, true),
('San Diego', 'CA', true, true),
('Kern', 'CA', true, false),
('Santa Barbara', 'CA', true, false)
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('business_name', 'Turbo Messengers', 'text', 'Company name'),
('business_phone', '(800) 555-0123', 'text', 'Main business phone number'),
('business_email', 'info@turbomessengers.com', 'text', 'Main business email'),
('rush_service_fee', '50', 'number', 'Rush service additional fee'),
('weekend_service_fee', '75', 'number', 'Weekend service additional fee'),
('after_hours_service_fee', '100', 'number', 'After hours service additional fee')
ON CONFLICT (setting_key) DO NOTHING;
