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
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = (session as any).subscription_data?.metadata?.supabase_user_id ||
          (session as any).client_reference_id

        if (!userId) {
          console.error('No user ID in checkout session')
          break
        }

        // Get the subscription ID from the session
        const subscriptionId = (session as any).subscription as string

        if (!subscriptionId) {
          console.log('No subscription in checkout session (one-time payment?)')
          break
        }

        // Retrieve full subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        // Get current_period_end from subscription items if not at root level
        const currentPeriodEnd = (subscription as any).current_period_end ||
          (subscription.items?.data?.[0] as any)?.current_period_end

        const updateData: any = {
          stripe_subscription_id: subscription.id,
          stripe_customer_id: (session as any).customer as string,
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        }

        // Only add period end if it exists and is valid
        if (currentPeriodEnd && typeof currentPeriodEnd === 'number') {
          updateData.subscription_current_period_end = new Date(currentPeriodEnd * 1000).toISOString()
        }

        const { data, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId)

        if (error) {
          console.error(`Failed to update user after checkout ${userId}:`, error)
        } else {
          console.log(`Checkout completed for user ${userId}, status: ${subscription.status}`, data)
        }
        break
      }

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

        const { data, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId)

        if (error) {
          console.error(`Failed to update subscription for user ${userId}:`, error)
        } else {
          console.log(`Updated subscription for user ${userId}: ${subscription.status}`, data)
        }
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

        const { data: paymentData, error: paymentError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId)

        if (paymentError) {
          console.error(`Failed to update after payment for user ${userId}:`, paymentError)
        } else {
          console.log(`Payment succeeded for user ${userId}`, paymentData)
        }
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
