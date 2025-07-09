import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

type SuccessAlertProps = {
  message: string;
};

export default function SuccessAlert({ message }: SuccessAlertProps) {
  return (
    <Alert variant="default" className="mb-4">
      <CheckCircle2Icon />
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
      </AlertDescription>
    </Alert>
  );
}
