import { createAdminClient } from './supabase/server'

export interface SubscriptionStatus {
  active: boolean
  status: string | null
  currentPeriodEnd: Date | null
}

export async function getUserSubscription(userId: string): Promise<SubscriptionStatus> {
  const supabase = createAdminClient()

  const { data: user, error } = await supabase
    .from('users')
    .select('subscription_status, subscription_current_period_end')
    .eq('id', userId)
    .single()

  if (error || !user) {
    return {
      active: false,
      status: null,
      currentPeriodEnd: null
    }
  }

  const isActive = user.subscription_status === 'active' || user.subscription_status === 'trialing'

  return {
    active: isActive,
    status: user.subscription_status,
    currentPeriodEnd: user.subscription_current_period_end
      ? new Date(user.subscription_current_period_end)
      : null
  }
}
