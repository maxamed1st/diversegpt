"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { forgetPassword } from "@/lib/auth/client";
import { Turnstile } from '@marsidev/react-turnstile'

const formSchema = z.object({
  email: z.string().email().nonempty({ message: "Email is required" }),
});

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);

    if (timer === 0) {
      setSuccess(false);
    }

    return () => clearInterval(interval);
  }, [timer, setTimer, setSuccess]);

  function requestPasswordReset(values: z.infer<typeof formSchema>) {
    forgetPassword({
      email: values.email,
      redirectTo: "/user/reset-password",
      fetchOptions: {
        headers: {
          "x-captcha-response": token!,
        },
        onRequest: () => {
          setLoading(true);
          setError(null);
        },
        onSuccess: () => {
          setSuccess(true);
          setTimer(45);
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          if (!ctx.error.message) {
            setError("Something went wrong. Please try again.");
          }
        },
        onResponse: () => {
          setLoading(false);
        },
      }
    });
  }

  return (
    <main className="grid place-content-center h-screen">
      <Card className="md:w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Forgot password</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Request passowrd reset to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(requestPasswordReset)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={setToken}
                options={{ size: "flexible" }}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              {success && (
                <p className="text-sm text-green-800">
                  Password reset link sent to your email
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading || success}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : success ? (
                  `Resend link in ${timer} seconds`
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}