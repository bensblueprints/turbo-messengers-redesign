# Turbo Messengers - Deployment Guide

## Quick Start

### 1. Initialize Database
After first deployment, visit the init endpoint to create all tables:
```
https://turbo-messengers-redesign.netlify.app/api/init
```

This will:
- Create all database tables (users, jobs, leads, services, counties, testimonials, etc.)
- Seed default services (Process Service, Court Filing, etc.)
- Seed default counties (LA, Orange, Ventura, etc.)
- Seed default settings
- Create admin user if not exists

### 2. Login to Admin
```
URL: https://turbo-messengers-redesign.netlify.app/admin/login
Email: admin@turbomessengers.com
Password: turbomessengers2026
```

### 3. Configure Settings
1. Go to `/admin/settings`
2. Update business information:
   - Business name
   - Phone number
   - Email
   - Service fees

### 4. Review Services
1. Go to `/admin/services`
2. Verify service offerings
3. Toggle active/inactive as needed
4. Update pricing if needed

### 5. Review Counties
1. Go to `/admin/counties`
2. Verify service areas
3. Enable/disable counties
4. Update rush fees and turnaround times

## Admin Dashboard Navigation

### Main Sections
- **Dashboard** (`/admin`) - Overview and quick stats
- **Leads** (`/admin/leads`) - New client inquiries
- **Jobs** (`/admin`) - Active service jobs (on main dashboard)
- **Clients** (`/admin`) - Client database (on main dashboard)
- **Services** (`/admin/services`) - Service offerings
- **Counties** (`/admin/counties`) - Service coverage areas
- **Testimonials** (`/admin/testimonials`) - Client reviews
- **Settings** (`/admin/settings`) - Global configuration

## Expected Data Flow

### New Lead → Client → Job
1. Lead comes in (website form, phone call, voice agent)
2. Lead appears in `/admin/leads` with status "New"
3. Admin contacts lead, updates status to "Contacted"
4. Lead qualifies, status → "Qualified"
5. Admin creates client account from lead
6. Lead status → "Converted"
7. Admin creates job for client
8. Job progresses: Pending → In Progress → Completed

### Job Service Flow
1. Job created (status: Pending)
2. Process server assigned
3. Job status → In Progress
4. Service attempts logged in `job_attempts` table
5. GPS location and photos recorded
6. Service completed
7. Job status → Completed
8. Proof of service uploaded

## Database Tables

### User Management
- `users` - All user accounts (clients and admins)

### Job Management
- `jobs` - Service jobs
- `job_attempts` - Service attempt logs with GPS/photos

### Lead Management
- `leads` - New inquiries and prospects

### Configuration
- `services` - Service offerings
- `counties` - Coverage areas
- `testimonials` - Client reviews
- `site_settings` - Global config

### Voice Agent (Optional)
- `voice_conversations` - ElevenLabs call logs
- `voice_service_requests` - Service requests from calls

## API Authentication

All admin API routes require:
1. Valid session (NextAuth)
2. User role = "admin"

Unauthorized requests return 401/403 errors.

## Default Data Seeded

### Services (6)
1. Process Service - $95-$150 (3-5 days)
2. Court Filing - $75-$125 (24-48 hours)
3. Small Claims - $125-$200 (24-48 hours)
4. Document Retrieval - $65-$150 (24-72 hours)
5. Skip Tracing - $150-$300 (3-7 days)
6. Notary Services - $50-$100 (same day)

### Counties (8)
1. Los Angeles
2. Orange
3. Ventura
4. San Bernardino
5. Riverside
6. San Diego
7. Kern
8. Santa Barbara

All active by default with rush service available.

### Settings
- `business_name` = Turbo Messengers
- `business_phone` = (800) 555-0123
- `business_email` = info@turbomessengers.com
- `rush_service_fee` = $50
- `weekend_service_fee` = $75
- `after_hours_service_fee` = $100

## Troubleshooting

### Database Connection Issues
Check DATABASE_URL in environment variables.

### Admin Login Fails
1. Verify database is initialized (`/api/init`)
2. Check admin user exists in `users` table
3. Verify NEXTAUTH_SECRET is set

### Tables Don't Exist
Run `/api/init` endpoint to create all tables.

### Cannot Add Leads/Services
1. Ensure logged in as admin
2. Check browser console for API errors
3. Verify database connection

### Voice Agent Not Working
1. Check ELEVENLABS_API_KEY is set
2. Verify ELEVENLABS_AGENT_ID is correct
3. Check webhook endpoints are accessible

## Production Checklist

- [ ] DATABASE_URL configured
- [ ] NEXTAUTH_SECRET set (32+ characters)
- [ ] NEXTAUTH_URL set to production domain
- [ ] Run `/api/init` to initialize database
- [ ] Verify admin login works
- [ ] Test creating lead
- [ ] Test creating client
- [ ] Test creating job
- [ ] Update site settings
- [ ] Configure services pricing
- [ ] Review county coverage
- [ ] Add testimonials
- [ ] Test voice agent (if enabled)

## Support

For technical support:
- GitHub: https://github.com/bensblueprints/turbo-messengers-redesign
- Email: admin@turbomessengers.com

## Next Steps

After deployment:
1. Customize services for your business
2. Add real client testimonials
3. Configure county-specific pricing
4. Train staff on admin dashboard
5. Test full workflow: Lead → Client → Job → Completion
