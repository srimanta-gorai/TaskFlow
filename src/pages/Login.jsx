
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      login(token, user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white">
            <LockKeyhole size={26} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to TaskFlow
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 focus-within:border-violet-500">
              <Mail size={18} className="text-slate-400" />

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-500"
            />
          </div>

          {successMessage && (
            <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              {successMessage}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-violet-600 hover:text-violet-800"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
