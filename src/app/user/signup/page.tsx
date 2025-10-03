"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { signIn } from "@/lib/auth/client";
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
import { signUpFormSchema } from "@/schema/user";
import { Turnstile } from '@marsidev/react-turnstile'

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    if (!token) {
      setError("invalid captcha");
      return;
    }

    signUp.email({
      name: values.fullName,
      email: values.email,
      password: values.password,
      callbackURL: "/dashboard/settings/brand",
      fetchOptions: {
        headers: {
          "x-captcha-response": token,
        },
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
          router.push("user/verify-email");
          setLoading(false);
        },
      }
    })
  }

  return (
    <main className="grid place-content-center h-screen">
      <Card className="md:w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="full-name">Full name</FormLabel>
                    <FormControl>
                      <Input
                        id="full-name"
                        placeholder="John Doe"
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
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
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
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password_confirmation">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="password_confirmation"
                        type="password"
                        placeholder="Password"
                        required
                        {...field}
                      />
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Create an account"
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