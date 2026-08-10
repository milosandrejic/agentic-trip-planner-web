"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Link,
  Alert,
  Button,
  FormLabel,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";

import { useAuth } from "@/hooks/use-auth";

import authEye from "@/assets/auth-eye.svg";

import {
  signInSchema,
  type SignInFormValues,
} from "@/components/auth/auth-schemas";

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f7f5f2",
    borderRadius: "12px",
    minHeight: 52,
  },
} as const;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to sign in. Please try again.";
}

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    isLoading,
    login,
  } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  async function handleFormSubmit(values: SignInFormValues): Promise<void> {
    try {
      await login(values);
    } catch (error) {
      setError("root", { message: getErrorMessage(error) });
    }
  }

  function handleForgotPassword(): void {
    setError("root", { message: "Password reset is not available yet." });
  }

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "20px 28px 28px",
      }}
    >
      {
        errors.root?.message &&
        <Alert severity="error">{errors.root.message}</Alert>
      }

      <Box>
        <FormLabel
          htmlFor="sign-in-email"
          sx={{
            color: "rgba(24, 49, 83, 0.7)",
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: "6px",
          }}
        >
          Email address
        </FormLabel>

        <TextField
          {...register("email")}
          id="sign-in-email"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          sx={fieldStyles}
        />
      </Box>

      <Box>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <FormLabel
            htmlFor="sign-in-password"
            sx={{
              color: "rgba(24, 49, 83, 0.7)",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Password
          </FormLabel>

          <Link
            component="button"
            type="button"
            underline="none"
            onClick={handleForgotPassword}
            sx={{
              color: "secondary.main",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Forgot password?
          </Link>
        </Box>

        <TextField
          {...register("password")}
          id="sign-in-password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    edge="end"
                    onClick={() => setShowPassword((isVisible) => !isVisible)}
                    size="small"
                  >
                    <Image
                      src={authEye}
                      alt=""
                      width={16}
                      height={16}
                      aria-hidden="true"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={fieldStyles}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{
          fontFamily: "var(--font-manrope)",
          fontSize: 15.5,
          fontWeight: 700,
          marginTop: "4px",
        }}
      >
        {isLoading ? "Signing In..." : "Sign In & Continue Planning"}
      </Button>
    </Box>
  );
}
