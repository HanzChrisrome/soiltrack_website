// src/pages/Unauthorized.tsx
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="text-lg mb-6">
        You do not have permission to access this page.
      </p>
      <Link to="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
};

export default Unauthorized;
