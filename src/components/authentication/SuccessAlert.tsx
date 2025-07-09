import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

type SuccessAlertProps = {
  message: string;
};

export default function SuccessAlert({ message }: SuccessAlertProps) {
  return (
    <Alert variant="default">
        <AlertCircleIcon />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          <p>{message}</p>
        </AlertDescription>
      </Alert>
  );
}
