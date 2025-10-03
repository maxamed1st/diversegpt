"use client"

import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function CaptchaPage({ searchParams }: { searchParams: Promise<{ redirectPath?: string }> }) {
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextPath = use(searchParams).redirectPath || '/';
  const router = useRouter();

  async function handleVerify(token: string) {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, redirectPath: nextPath })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data['error-codes']?.join(', ') || 'Verification failed');
      }

      const data = await response.json();

      setIsVerified(true);
      setError(null);
      router.replace(data.redirectPath || nextPath);
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification');
      setIsVerified(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded bg-white p-6 shadow">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">
          Verify You're Human
        </h1>
        <Turnstile
          siteKey="0x4AAAAAAB4jgaDPJ3W5WNmD"
          options={{ size: "flexible" }}
          onSuccess={(token) => {handleVerify(token);}}
          onError={() => {
            setError("Captcha error occurred");
          }}
          onExpire={() => {
            setError("Captcha token expired");
          }}
        />
        {isVerified && (
          <p className="mt-4 text-center text-green-600">
            Verification successful!
          </p>
        )}
        {error && (
          <p className="mt-4 text-center text-red-600">Error: {error}</p>
        )}
      </div>
    </div>
  );
}