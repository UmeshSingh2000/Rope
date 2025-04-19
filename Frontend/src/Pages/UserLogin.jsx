import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const URL = import.meta.env.VITE_BACKENDAPI_URL;

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email) {
        toast.error("Please enter your email.");
        return;
      }
      if (!password) {
        toast.error("Please enter your password.");
        return;
      }

      const response = await axios.post(`${URL}/userLogin`, {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Login successful!");

        navigate("/home");
      }
    } catch (error) {
      if (!error.response) {
      // 🚨 Server is down or not reachable
      toast.error("Can't connect to server. Please try again later.")
    } else if (error.response.status >= 500) {
      // 🔧 Server error (5xx)
      toast.error('Server error. Please try again later.')
    } else {
      // ❌ Bad credentials or other client-side error
      toast.error(error.response.data.message || 'Login failed.')
    }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-4">
      <Card className="bg-zinc-900 border border-zinc-800 text-white w-full max-w-sm rounded-3xl shadow-2xl p-6 transition-all">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-zinc-400 text-sm">
            Log in to continue where you left off
          </p>
        </div>

        <CardContent className="p-0 space-y-5">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Email address
              </label>
              <Input
                placeholder="you@example.com"
                className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-right mt-2">
                <a
                  href="#"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all py-2 rounded-xl shadow-md"
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-400 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/userSignup"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;
