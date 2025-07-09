import { LoginFormSchema } from "../../lib/schemas.ts";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth.ts";
import { useState } from "react";
import ErrorAlert from "./ErrorAlert.tsx";

type FormSchema = z.infer<typeof LoginFormSchema>;

export default function LoginCard() {
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValidating },
  } = form;

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      const { email, password } = data;
      await login(email, password);
      navigate({ to: "/", replace: true });
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email and password below to login.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 mb-6">
            {error && <ErrorAlert message={error} />}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link to="/forgot-password">
                      <p className="text-sm text-primary hover:underline">
                        Forgot Password?
                      </p>
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-row-reverse gap-4">
            <Button type="submit" disabled={isSubmitting || isValidating}>
              Login
            </Button>
            <Link to="/signup">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting || isValidating}
              >
                Sign Up
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
