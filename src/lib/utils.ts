import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(
  error: unknown,
  defaultMessage: string = "Something went wrong",
) {
  console.error(error);
  let errorMessage = defaultMessage;
  if (error instanceof Error && error.message.length < 100) {
    errorMessage = error.message;
  }
  return errorMessage;
}

export function formatScore(score: number) {
  if (score > 1000) {
    return `${(score / 1000).toFixed(1)}k`;
  }
  return score;
}
