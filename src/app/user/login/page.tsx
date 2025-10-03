"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth/client";
import Link from "next/link";
import { cn } from "@/utils/cn";
import Discord from "@/components/user/Discord";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "@/schema/user";
import { useRouter } from "next/navigation";
import { Turnstile } from '@marsidev/react-turnstile'

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    if (!token) {
      setError("invalid captcha");
      return;
    }

    signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
      callbackURL: "/dashboard",
      fetchOptions: {
        headers: {
          "x-captcha-response": token,
        },
        onRequest: (_ctx) => {
          setLoading(true);
          setError(null);
        },
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            return router.push("/user/verify-email");
          }
          setError(ctx.error.message);
          if (!ctx.error.message) {
            toast.error("Something went wrong. Please try again.");
          }
        },
        onResponse: (_ctx) => {
          setLoading(false);
        },
      }
    })
  }

  return (
    <main className="grid place-content-center h-screen">
      <Card className="md:w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Link
                        href="/user/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="password"
                        required
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex gap-2">
                    <FormLabel htmlFor="remember">Remember me</FormLabel>
                    <FormControl>
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={setToken}
                options={{ size: "flexible" }}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="w-full gap-2 flex items-center justify-between flex-col">
              <Button
                variant="outline"
                className={cn(
                  "w-full gap-2"
                )}
                disabled={loading}
                onClick={async () => {
                  await signIn.social(
                    {
                      provider: "discord",
                      callbackURL: "/dashboard/",
                      newUserCallbackURL: "/dashboard/settings/brand",
                    },
                    {
                      onRequest: (_ctx) => {
                        setLoading(true);
                        setError(null);
                      },
                      onError: (ctx) => {
                        setError(ctx.error.message);
                        if (!ctx.error.message) {
                          toast.error("Something went wrong. Please try again.");
                        }
                        setLoading(false);
                      },
                      onSuccess: async () => {
                        setLoading(false);
                      },
                    },
                  );
                }}
              >
                <Discord />
                Sign in with Discord
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}