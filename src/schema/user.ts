import { z } from "zod";

export const signUpFormSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Must be at least 2 characters" }),
  email: z.string().email().trim().toLowerCase().nonempty({ message: "Email is required" }),
  password: z.string().min(8, { message: "Must be at least 8 characters" }),
  passwordConfirmation: z.string().min(8, { message: "Must be at least 8 characters" }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords don't match",
  path: ["passwordConfirmation"],
});

export const loginFormSchema = z.object({
  email: z.string().email().nonempty({ message: "Email is required" }).toLowerCase().trim(),
  password: z.string().min(8),
  rememberMe: z.boolean().default(false),
});

const passwordField = z.string()
  .transform((value) => value || undefined)
  .optional()
  .refine((value) => value === undefined || value.length >= 8, "Must be at least 8 characters")

export const accountSettingsSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Must be at least 2 characters" }),
  email: z.string().email().trim().toLowerCase().nonempty({ message: "Email is required" }),
  currentPassword: passwordField,
  newPassword: passwordField,
  passwordConfirmation: passwordField,
}).superRefine((data, ctx) => {
  const anyPasswordFieldFilled = data.newPassword || data.passwordConfirmation;
  const allPasswordFieldsFilled = !!data.currentPassword && !!data.newPassword && !!data.passwordConfirmation;

  if (anyPasswordFieldFilled && !allPasswordFieldsFilled) {
    if (!data.currentPassword) {
      ctx.addIssue({
        path: ["currentPassword"],
        code: z.ZodIssueCode.custom,
        message: "Current password is required",
      });
    }
    if (!data.newPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        code: z.ZodIssueCode.custom,
        message: "New password is required",
      });
    }
    if (!data.passwordConfirmation) {
      ctx.addIssue({
        path: ["passwordConfirmation"],
        code: z.ZodIssueCode.custom,
        message: "Password confirmation is required",
      });
    }
  }

  if (
    data.newPassword &&
    data.passwordConfirmation &&
    data.newPassword !== data.passwordConfirmation
  ) {
    ctx.addIssue({
      path: ["passwordConfirmation"],
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
    });
  }
})