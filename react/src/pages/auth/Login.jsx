import { useGoogleLogin } from "@react-oauth/google";
import api from "../../api/Axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post("/auth/google", {
          token: tokenResponse.access_token,
        });
        localStorage.setItem("token", res.data.token);
        navigate("/main");
      } catch (error) {
        console.log("Login failed", error);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow blobs */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: -100,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #fff 0%, #ccc 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 0 32px rgba(255,255,255,0.18)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                stroke="#000"
                strokeWidth="2"
              />
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#fff",
              margin: "0 0 6px",
              letterSpacing: "-0.3px",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0 }}
          >
            Sign in to continue to your account
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            borderRadius: 20,
            padding: "2rem",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Google Button */}
          <button
            onClick={() => login()}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "12px 16px",
              borderRadius: 12,
              border: "0.5px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500,
              color: "#fff",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 256 262"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              />
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              />
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
              />
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: 12,
              margin: "1.5rem 0",
            }}
          >
            <div
              style={{ height: "0.5px", background: "rgba(255,255,255,0.1)" }}
            />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              or continue with email
            </span>
            <div
              style={{ height: "0.5px", background: "rgba(255,255,255,0.1)" }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 6,
              }}
            >
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px 14px",
                borderRadius: 10,
                border: "0.5px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                Password
              </label>
              {/* <a
                href="#"
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </a> */}
            </div>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px 14px",
                borderRadius: 10,
                border: "0.5px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          {/* Sign in */}
          <button
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #fff 0%, #d4d4d4 100%)",
              color: "#000",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 0 28px rgba(255,255,255,0.2)",
            }}
          >
            Sign in
          </button>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "rgba(255,255,255,0.35)",
            marginTop: "1.5rem",
          }}
        >
          Don't have an account?
          <a
            href="#"
            style={{
              color: "#fff",
              fontWeight: 500,
              textDecoration: "none",
              marginLeft: 4,
            }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
