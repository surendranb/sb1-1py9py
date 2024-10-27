import { useStore } from '../lib/store';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, CreditCard, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const { user, credits } = useStore();

  const handleLogout = () => signOut(auth);

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center text-xl font-bold">
              SaaS Boilerplate
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Credits: {credits}
              </div>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                <Gauge className="h-5 w-5" />
              </Link>
              <Link to="/billing" className="text-gray-600 hover:text-gray-900">
                <CreditCard className="h-5 w-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}