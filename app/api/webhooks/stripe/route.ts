import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (!userId) {
          console.error('No supabase_user_id in subscription metadata')
          break
        }

        // Get current_period_end from subscription items if not at root level
        const currentPeriodEnd = (subscription as any).current_period_end ||
          (subscription.items?.data?.[0] as any)?.current_period_end

        const updateData: any = {
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        }

        // Only add period end if it exists and is valid
        if (currentPeriodEnd && typeof currentPeriodEnd === 'number') {
          updateData.subscription_current_period_end = new Date(currentPeriodEnd * 1000).toISOString()
        }

        await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId)

        console.log(`Updated subscription for user ${userId}: ${subscription.status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (!userId) {
          console.error('No supabase_user_id in subscription metadata')
          break
        }

        await supabase
          .from('users')
          .update({
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)

        console.log(`Canceled subscription for user ${userId}`)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string

        if (!subscriptionId) break

        // Get subscription to find user
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata.supabase_user_id

        if (!userId) {
          console.error('No supabase_user_id in subscription metadata')
          break
        }

        // Get current_period_end from subscription items if not at root level
        const currentPeriodEnd = (subscription as any).current_period_end ||
          (subscription.items?.data?.[0] as any)?.current_period_end

        const updateData: any = {
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        }

        // Only add period end if it exists and is valid
        if (currentPeriodEnd && typeof currentPeriodEnd === 'number') {
          updateData.subscription_current_period_end = new Date(currentPeriodEnd * 1000).toISOString()
        }

        await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId)

        console.log(`Payment succeeded for user ${userId}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string

        if (!subscriptionId) break

        // Get subscription to find user
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata.supabase_user_id

        if (!userId) {
          console.error('No supabase_user_id in subscription metadata')
          break
        }

        await supabase
          .from('users')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)

        console.log(`Payment failed for user ${userId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
