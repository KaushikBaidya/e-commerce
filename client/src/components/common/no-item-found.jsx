import { AlertTriangle } from 'lucide-react';

const NoItemFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full  text-center px-4">
      <div className="flex items-center justify-center p-6 rounded-2xl ">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="text-red-500 w-12 h-12" />
          <h1 className="text-3xl font-semibold text-gray-800">No items found</h1>
        </div>
      </div>
    </div>
  );
};

export default NoItemFound;
