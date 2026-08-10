"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Alert,
  Button,
  FormLabel,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from "@mui/material";

import { useAuth } from "@/hooks/use-auth";

import authEye from "@/assets/auth-eye.svg";

import {
  signUpSchema,
  type SignUpFormValues,
} from "@/components/auth/auth-schemas";

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f7f5f2",
    borderRadius: "12px",
    minHeight: 52,
  },
} as const;

const labelStyles = {
  color: "rgba(24, 49, 83, 0.7)",
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: "6px",
} as const;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to create your account. Please try again.";
}

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    isLoading,
    register: registerUser,
  } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  async function handleFormSubmit(values: SignUpFormValues): Promise<void> {
    try {
      await registerUser(values);
    } catch (error) {
      setError("root", { message: getErrorMessage(error) });
    }
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
        <FormLabel htmlFor="sign-up-first-name" sx={labelStyles}>
          First name
        </FormLabel>

        <TextField
          {...register("first_name")}
          id="sign-up-first-name"
          placeholder="Alex"
          autoComplete="given-name"
          error={Boolean(errors.first_name)}
          helperText={errors.first_name?.message}
          sx={fieldStyles}
        />
      </Box>

      <Box>
        <FormLabel htmlFor="sign-up-last-name" sx={labelStyles}>
          Last name
        </FormLabel>

        <TextField
          {...register("last_name")}
          id="sign-up-last-name"
          placeholder="Martini"
          autoComplete="family-name"
          error={Boolean(errors.last_name)}
          helperText={errors.last_name?.message}
          sx={fieldStyles}
        />
      </Box>

      <Box>
        <FormLabel htmlFor="sign-up-email" sx={labelStyles}>
          Email address
        </FormLabel>

        <TextField
          {...register("email")}
          id="sign-up-email"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          sx={fieldStyles}
        />
      </Box>

      <Box>
        <FormLabel htmlFor="sign-up-password" sx={labelStyles}>
          Password
        </FormLabel>

        <TextField
          {...register("password")}
          id="sign-up-password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
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
        {isLoading ? "Creating Account..." : "Create Account & Continue"}
      </Button>

      <Typography
        component="p"
        sx={{
          color: "rgba(24, 49, 83, 0.4)",
          fontSize: 12.5,
          lineHeight: 1.5,
          textAlign: "center",
          whiteSpace: { sm: "nowrap" },
        }}
      >
        By creating an account you agree to our{" "}
        <Box component="span" sx={{ color: "secondary.main" }}>
          Terms
        </Box>{" "}
        and{" "}
        <Box component="span" sx={{ color: "secondary.main" }}>
          Privacy Policy
        </Box>
        .
      </Typography>
    </Box>
  );
}
