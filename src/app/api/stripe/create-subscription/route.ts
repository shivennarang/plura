import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { customerId, priceId } = await req.json();
  if (!customerId || !priceId) {
    return new NextResponse('Customer Id or price id is missing', {
      status: 400,
    });
  }

  try {
    const subscriptionExists = await db.agency.findFirst({
      where: { customerId },
      include: { Subscription: true },
    });

    if (subscriptionExists?.Subscription?.subscritiptionId && subscriptionExists.Subscription.active) {
      // Update existing subscription
      const currentSubscriptionDetails = await stripe.subscriptions.retrieve(
        subscriptionExists.Subscription.subscritiptionId
      );

      const subscription = await stripe.subscriptions.update(
        subscriptionExists.Subscription.subscritiptionId,
        {
          items: [
            {
              id: currentSubscriptionDetails.items.data[0].id,
              price: priceId,
            },
          ],
          expand: ['latest_invoice.payment_intent'],
        }
      );

      // Check 'latest_invoice' and 'payment_intent' type
      const latestInvoice = subscription.latest_invoice;
      let clientSecret = null;

      if (typeof latestInvoice !== 'string' && latestInvoice?.payment_intent) {
        const paymentIntent = latestInvoice.payment_intent;
        if (typeof paymentIntent !== 'string' && paymentIntent.client_secret) {
          clientSecret = paymentIntent.client_secret;
        }
      }

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: clientSecret,
      });

    } else {
      // Create new subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Check 'latest_invoice' and 'payment_intent' type
      const latestInvoice = subscription.latest_invoice;
      let clientSecret = null;

      if (typeof latestInvoice !== 'string' && latestInvoice?.payment_intent) {
        const paymentIntent = latestInvoice.payment_intent;
        if (typeof paymentIntent !== 'string' && paymentIntent.client_secret) {
          clientSecret = paymentIntent.client_secret;
        }
      }

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: clientSecret,
      });
    }
  } catch (error) {
    console.error('🔴 Error:', error);
    return new NextResponse('Internal Server Error', {
      status: 500,
    });
  }
}
