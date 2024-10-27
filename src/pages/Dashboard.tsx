import { useEffect } from 'react';
import { useStore } from '../lib/store';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Gauge } from 'lucide-react';

export function Dashboard() {
  const { user, credits, subscription } = useStore();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        useStore.setState({
          credits: data.credits,
          subscription: data.subscription
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Gauge className="h-5 w-5 text-indigo-600" />
            <span className="text-lg font-medium">{credits} credits remaining</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Subscription Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="text-lg font-medium">
                {subscription ? subscription.charAt(0).toUpperCase() + subscription.slice(1) : 'Free Tier'}
              </p>
            </div>
            {!subscription && (
              <a
                href="/billing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Upgrade Plan
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}