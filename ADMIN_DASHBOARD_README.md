# Turbo Messengers - Admin Dashboard Expansion

## Overview
Complete admin dashboard for managing a process serving / legal document delivery business.

## Services Offered
- Process Service (summons, subpoenas, complaints)
- Court Filing (all Southern California courts)
- Small Claims (document preparation)
- Document Retrieval
- Skip Tracing
- Notary Services

## Admin Credentials
- Email: `admin@turbomessengers.com`
- Password: `turbomessengers2026`

## Database Setup

### Initialize Database
Visit `/api/init` to create all tables and seed initial data:
```
https://turbo-messengers-redesign.netlify.app/api/init
```

### Database Tables

#### Core Tables (Existing)
- `users` - User accounts (clients and admins)
- `jobs` - Service jobs with status tracking
- `documents` - File uploads for jobs

#### Extended Tables (New)
- `leads` - New client inquiries and lead management
- `services` - Service offerings configuration
- `counties` - Service area coverage (SoCal counties)
- `testimonials` - Client reviews and testimonials
- `job_attempts` - Service attempt tracking with GPS/photos
- `site_settings` - Global configuration

## Admin Pages

### Dashboard (`/admin`)
- Overview stats (jobs, clients, leads)
- Quick links to all admin sections
- Recent jobs view
- Add client/order modals

### Leads Management (`/admin/leads`)
- View all leads
- Filter by status (new, contacted, qualified, converted, closed)
- Search by name, email, company
- Update lead status
- Add new leads manually
- Lead sources: website, phone, referral, voice_agent

### Services Management (`/admin/services`)
- View all service offerings
- Toggle active/inactive
- Default services pre-configured:
  - Process Service ($95-$150)
  - Court Filing ($75-$125)
  - Small Claims ($125-$200)
  - Document Retrieval ($65-$150)
  - Skip Tracing ($150-$300)
  - Notary Services ($50-$100)

### Counties Management (`/admin/counties`)
- Manage service coverage areas
- Toggle county availability
- Configure rush service fees
- Standard turnaround times
- Pre-configured SoCal counties:
  - Los Angeles, Orange, Ventura
  - San Bernardino, Riverside, San Diego
  - Kern, Santa Barbara

### Testimonials (`/admin/testimonials`)
- Manage client reviews
- Toggle published/unpublished
- Mark as featured
- Star ratings (1-5)
- Service type tagging

### Settings (`/admin/settings`)
- Global site configuration
- Business information
- Pricing settings (rush, weekend, after-hours fees)
- Contact details

### Jobs Management
- View all jobs
- Filter by status
- Update job status
- Track service attempts
- GPS location tracking
- Photo documentation

### Clients Management
- View all clients
- Client job history
- Add new clients
- Create orders for clients

## API Routes

### Leads
- `GET /api/admin/leads` - Fetch all leads
- `POST /api/admin/leads` - Create lead
- `PATCH /api/admin/leads` - Update lead

### Services
- `GET /api/admin/services` - Fetch all services
- `POST /api/admin/services` - Create service
- `PATCH /api/admin/services` - Update service
- `DELETE /api/admin/services` - Delete service

### Counties
- `GET /api/admin/counties` - Fetch all counties
- `POST /api/admin/counties` - Create county
- `PATCH /api/admin/counties` - Update county
- `DELETE /api/admin/counties` - Delete county

### Testimonials
- `GET /api/admin/testimonials` - Fetch all testimonials
- `POST /api/admin/testimonials` - Create testimonial
- `PATCH /api/admin/testimonials` - Update testimonial
- `DELETE /api/admin/testimonials` - Delete testimonial

### Settings
- `GET /api/admin/settings` - Fetch all settings
- `POST /api/admin/settings` - Create setting
- `PATCH /api/admin/settings` - Update setting

### Jobs (Existing)
- `GET /api/admin/jobs` - Fetch all jobs
- `POST /api/admin/jobs` - Create job
- `PATCH /api/admin/jobs` - Update job status

### Clients (Existing)
- `GET /api/admin/clients` - Fetch all clients
- `POST /api/admin/clients` - Create client

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Neon Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://turbo-messengers-redesign.netlify.app"

# ElevenLabs Voice Agent (Optional)
ELEVENLABS_API_KEY="sk_..."
ELEVENLABS_AGENT_ID="agent_..."
```

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Neon PostgreSQL
- NextAuth (authentication)
- Lucide Icons

## Database Functions

All database operations are in `/src/lib/db.ts`:

### Leads
- `getAllLeads()` - Fetch all leads
- `getLeadById(id)` - Get single lead
- `createLead(data)` - Create lead
- `updateLead(id, data)` - Update lead
- `convertLeadToClient(leadId, clientId)` - Convert lead to client

### Services
- `getAllServices()` - Fetch all services
- `getActiveServices()` - Fetch active services only
- `createService(data)` - Create service
- `updateService(id, data)` - Update service
- `deleteService(id)` - Delete service

### Counties
- `getAllCounties()` - Fetch all counties
- `getActiveCounties()` - Fetch active counties only
- `createCounty(data)` - Create county
- `updateCounty(id, data)` - Update county
- `deleteCounty(id)` - Delete county

### Testimonials
- `getAllTestimonials()` - Fetch all testimonials
- `getPublishedTestimonials()` - Fetch published only
- `getFeaturedTestimonials()` - Fetch featured testimonials
- `createTestimonial(data)` - Create testimonial
- `updateTestimonial(id, data)` - Update testimonial
- `deleteTestimonial(id)` - Delete testimonial

### Settings
- `getAllSettings()` - Fetch all settings
- `getSettingByKey(key)` - Get single setting
- `updateSetting(key, value)` - Update setting
- `createSetting(key, value, type, description)` - Create setting

### Job Attempts
- `getJobAttempts(jobId)` - Fetch attempts for job
- `createJobAttempt(data)` - Record service attempt

## Features

### Lead Management
- Track new inquiries from multiple sources
- Status progression: New → Contacted → Qualified → Converted
- Notes and follow-up tracking
- Automatic timestamp on status changes

### Job Tracking
- Full lifecycle: Pending → In Progress → Completed
- Rush service support
- Multiple service attempts tracking
- GPS location logging
- Photo documentation
- Proof of service URL

### Client Portal Integration
- Clients can login and view their jobs
- Place new service requests
- Track job status in real-time

### Admin Features
- Quick action buttons
- Real-time statistics
- Search and filtering
- Status updates via dropdowns
- Modal-based forms
- Success/error notifications
- Responsive design (mobile-friendly)

## Deployment

### Netlify
Site ID: `090922f6-3c7a-4805-949b-d62bbf16402c`

Deploy:
```bash
npm run build
netlify deploy --prod
```

### Database Migration
Run `/api/init` after deployment to initialize all tables.

## Future Enhancements
- [ ] Individual lead detail page with conversion workflow
- [ ] Job detail page with timeline and attempt history
- [ ] Document upload for jobs
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Calendar view for scheduled services
- [ ] Process server assignment
- [ ] Financial reporting
- [ ] Invoice generation
- [ ] Client communication history

## Support
For questions or issues, contact: admin@turbomessengers.com
