import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/reset-password')({
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: "/" });
    }
  },
  component: ResetPassword,
})

function ResetPassword() {
  return <div>Reset Password</div>
}
