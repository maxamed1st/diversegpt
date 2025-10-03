"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function VerifyEmail() {
  return (
    <main className="grid place-content-center h-screen">
      <Card className="md:w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Verify your email</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 text-muted-foreground">
          Check your email for a verification link
        </CardContent>
      </Card>
    </main>
  );
}