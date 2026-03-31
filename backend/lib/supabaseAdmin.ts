import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

// Service-role client — bypasses RLS. Only use in server-side API routes.
// Never expose this key to the client.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Call this at top of every API handler to fail fast with a clean JSON error
// rather than a cryptic 500 HTML page when env vars are missing.
export function assertEnv(res: { status: (code: number) => { json: (body: unknown) => void } }): boolean {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    res.status(500).json({
      error: 'Server misconfiguration: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set',
    })
    return false
  }
  return true
}


// ─── Shared types ────────────────────────────────────────────────────────────

export type TenantPlan = 'trial' | 'starter' | 'pro'
export type SubscriptionStatus = 'active' | 'read_only' | 'cancelled' | 'trial'
export type UserRole = 'viewer' | 'operator' | 'master'
export type Language = 'en' | 'hi' | 'kn'
export type EntryCategory = 'material' | 'labour' | 'service'
export type EntryStatus = 'pending' | 'approved' | 'rejected'
export type AttachmentType = 'bill' | 'site_photo' | 'other'
export type AuditAction = 'created' | 'edited' | 'approved' | 'rejected'

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: TenantPlan
  subscription_status: SubscriptionStatus | null
  razorpay_subscription_id: string | null
  referred_by_code: string | null
  trial_ends_at: string | null
  created_at: string
}

export interface TenantUser {
  id: string
  tenant_id: string
  user_id: string
  role: UserRole
  name: string | null
  phone: string | null
  language: Language
  created_at: string
}

export interface Site {
  id: string
  tenant_id: string
  name: string
  location: string | null
  is_active: boolean
  created_at: string
}

export interface Entry {
  id: string
  tenant_id: string
  site_id: string
  category: EntryCategory
  entry_date: string
  item_name: string
  quantity: number | null
  unit: string | null
  rate: number | null
  total_amount: number
  vendor_name: string | null
  bill_number: string | null
  notes: string | null
  status: EntryStatus
  submitted_by: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}
