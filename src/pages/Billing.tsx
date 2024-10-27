import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const plans = [
  {
    name: 'Monthly',
    price: '$29',
    credits: '5,000 credits/month',
    features: ['Unlimited access', 'Priority support', 'API access'],
    interval: 'month'
  },
  {
    name: 'Annual',
    price: '$290',
    credits: '5,000 credits/month',
    features: ['Everything in Monthly', '2 months free', 'Higher API limits'],
    interval: 'year'
  }
];

export function Billing() {
  const { user, subscription } = useStore();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (interval: string) => {
    if (!user) return;
    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          interval
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Upgrade Your Plan</h1>
        <p className="mt-4 text-lg text-gray-600">
          Choose the perfect plan for your needs
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.interval}
            className="bg-white rounded-lg shadow-lg divide-y divide-gray-200"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500">/{plan.interval}</span>
              </p>
              <p className="mt-2 text-gray-500">{plan.credits}</p>
            </div>
            <div className="px-6 pt-6 pb-8">
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="flex-shrink-0 h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.interval)}
                disabled={loading || subscription === plan.interval}
                className="mt-8 w-full bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 disabled:opacity-50"
              >
                {subscription === plan.interval
                  ? 'Current Plan'
                  : `Subscribe ${plan.interval}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}