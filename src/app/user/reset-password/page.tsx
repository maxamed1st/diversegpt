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
import { use, useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
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
import { resetPassword } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  password: z.string().min(8, { message: "Must be at least 8 characters" }),
  passwordConfirmation: z.string().min(8, { message: "Must be at least 8 characters" }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords don't match",
  path: ["passwordConfirmation"],
});

export default function ResetPassword({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { token } = use(searchParams);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  useEffect(() => {
    if (!token) {
      router.push("/user/forgot-password");
    }
  }, [token, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await resetPassword({
      newPassword: values.password,
      token,
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
          setError(null);
        },
        onSuccess: () => {
          setSuccess(true);
          router.push("/user/login");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          if (!ctx.error.message) {
            setError("Something went wrong. Please try again.");
          }
        },
        onResponse: (_ctx) => {
          setLoading(false);
        },
      }
    });
  }

  return (
    <main className="grid place-content-center h-screen">
      <Card className="md:w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            set your new password
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className={`w-full ${success && "bg-green-500"}`} disabled={loading || success}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : success ? (
                  <Check size={16} />
                ) : (
                  "Change password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}