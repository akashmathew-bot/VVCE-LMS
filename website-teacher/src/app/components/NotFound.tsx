import { Link } from "react-router";
import { Home } from "lucide-react";
import { Button } from "./ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
          <Home className="w-4 h-4 mr-2" />
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}
