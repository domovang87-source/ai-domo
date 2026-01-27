import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserSubscription } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ active: false }, { status: 401 })
    }

    const subscription = await getUserSubscription(user.id)

    return NextResponse.json({
      active: subscription.active,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
    })
  } catch (err: any) {
    console.error('Check subscription error:', err)
    return NextResponse.json(
      { active: false, error: err.message },
      { status: 500 }
    )
  }
}
