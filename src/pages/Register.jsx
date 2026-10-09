
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, LockKeyhole } from "lucide-react";

const API_URL = "http://localhost:5000/api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (new TextEncoder().encode(password).length < 8) {
      setError("Password must contain at least 8 bytes.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      // Registration creates the account.
      // The user signs in separately on the Login page.
      navigate("/login", {
        state: { message: "Account created successfully. Please sign in." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again."
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
            <UserPlus size={26} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Get started with TaskFlow today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Full name
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 focus-within:border-violet-500">
              <User size={18} className="text-slate-400" />

              <input
                id="name"
                type="text"
                autoComplete="name"
                minLength={2}
                maxLength={50}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                className="w-full py-3 text-sm outline-none"
              />
            </div>
          </div>

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
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Re-enter your password"
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-500"
            />
          </div>

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
            className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-violet-600 hover:text-violet-800"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
