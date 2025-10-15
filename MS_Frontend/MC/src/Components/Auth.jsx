import React, { useState } from "react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignUp ? "/signUp" : "/signIn";

    try {
      const response = await fetch(`http://localhost:8080${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const data = await response.json().catch(() => response.text());
      if (typeof data === "string") {
        setMessage(data);
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Logged in successfully!");
      }
    } catch (err) {
      setMessage("⚠️ Server not reachable!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6 tracking-wide">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold p-3 rounded-lg transition duration-200"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 text-sm ${
              message.includes("success") || message.includes()
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-gray-200 hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-gray-200 hover:underline"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
