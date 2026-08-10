import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const signUpSchema = z.object({
  country: z.string().trim().length(2, "Use a 2-letter country code.").optional(),
  email: z.string().trim().email("Enter a valid email address."),
  first_name: z.string().trim().min(1, "Enter your first name."),
  last_name: z.string().trim().min(1, "Enter your last name."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
