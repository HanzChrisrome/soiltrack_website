import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

import { Loader2, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const { forgotPassword, isForgotPassword } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword(formData.email);
  };

  return (
    <>
      <div className="flex flex-col justify-center text-center space-y-12">
        <h2 className="text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
          Reset your<br /> Password
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="form-control">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="text"
                className="input input-bordered rounded-xl w-full pl-10"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-primary text-white w-full hover:bg-secondary"
            disabled={isForgotPassword}
          >
            {isForgotPassword ? (
              <>
                {" "}
                <Loader2 className="h-5 w-5 animate-spin" /> Loading...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        <p className="text-center">
            <Link to="/login" className="text-primary">
            Go back to login
            </Link>
        </p>
      </div>    
    </>
  );
};

export default ForgotPassword;
