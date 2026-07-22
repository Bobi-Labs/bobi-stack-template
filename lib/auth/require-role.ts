/**
 * requireRole — the complete auth check, made the path of least resistance.
 *
 * This file exists because of a real incident. Four routes in a production
 * client system correctly verified that a caller was signed in and then did
 * nothing with the answer: any account of any role could submit compliance
 * audits, write rows with the service role, and spend money on a paid AI
 * endpoint. `getUser()` answers "is this someone?" and reads like security.
 * The question that matters is "is this someone who may do THIS?"
 *
 * When only the easy half of the check is convenient, only the easy half
 * gets written. So the complete check lives here, one import away.
 *
 * Usage in a route handler:
 *
 *   const gate = await requireRole('operator')
 *   if (!gate.ok) return gate.response
 *   // gate.user is signed in AND authorized from here on
 *
 * Roles are read from `app_metadata.role`, which only the service role can
 * write. Never read a role from `user_metadata`: that is user-writable, so
 * a caller could grant themselves anything.
 */
import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

type Gate =
  | { ok: true; user: User; role: string }
  | { ok: false; response: NextResponse }

/**
 * Require a signed-in caller holding one of `allowed` roles.
 *
 * Returns 401 when nobody is signed in and 403 when someone is signed in
 * but lacks the role, because those are different facts and the caller
 * (and your logs) benefit from the distinction.
 */
export async function requireRole(...allowed: string[]): Promise<Gate> {
  if (allowed.length === 0) {
    // A role gate with no roles would pass everyone, which is the exact
    // failure this helper exists to prevent. Fail closed, loudly.
    throw new Error('requireRole() called with no roles. Name the roles that may do this.')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Sign-in required.' }, { status: 401 }),
    }
  }

  // app_metadata is service-role-writable only. user_metadata is not.
  const role = (user.app_metadata as { role?: unknown } | null)?.role
  if (typeof role !== 'string' || !allowed.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'You do not have access to this.' },
        { status: 403 },
      ),
    }
  }

  return { ok: true, user, role }
}

/**
 * Require a valid cron secret on a machine-called route.
 *
 * Two deliberate behaviours, both learned the hard way:
 *  - An unset secret REJECTS every request. An unconfigured secret is a
 *    broken deploy, not an open door.
 *  - Returns 401, never a redirect. A 307 silently breaks Vercel Cron,
 *    which follows it and reports success while nothing ran.
 */
export function requireCronSecret(req: Request): NextResponse | null {
  const expected = process.env.CRON_SECRET
  if (!expected) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured.' }, { status: 401 })
  }
  const got = req.headers.get('authorization')
  if (got !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
  return null
}
