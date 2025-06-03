import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div className="flex items-center justify-center bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="text-red-500 w-12 h-12" />
          <h1 className="text-3xl font-semibold text-gray-800">404 - Page Not Found</h1>
          <p className="text-gray-600 max-w-md">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
