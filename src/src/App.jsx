import { useEffect, useState } from "react";

const WAIT_SECONDS = 5;

export default function App() {
  const [seconds, setSeconds] = useState(WAIT_SECONDS);
  const [error, setError] = useState("");

  useEffect(() => {
    let remaining = WAIT_SECONDS;

    const timer = window.setInterval(() => {
      remaining -= 1;
      setSeconds(remaining);

      if (remaining <= 0) {
        window.clearInterval(timer);
        redirect();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  async function redirect() {
    try {
      const response = await fetch("/api/redirect", {
        method: "GET",
        cache: "no-store",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error("Redirect failed");
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("Missing redirect URL");
      }

      window.location.replace(data.url);
    } catch {
      setError("The redirect is unavailable. Please try again later.");
    }
  }

  return (
    <main className="page">
      <section className="card" aria-live="polite">
        {error ? (
          <>
            <h1>Unable to continue</h1>
            <p>{error}</p>
          </>
        ) : (
          <>
            <div className="spinner" />
            <h1>Please wait</h1>
            <p>Continuing in {seconds} second{seconds === 1 ? "" : "s"}...</p>
          </>
        )}
      </section>
    </main>
  );
}
