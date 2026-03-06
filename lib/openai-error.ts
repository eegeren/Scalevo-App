export const GENERIC_AI_ERROR_MESSAGE = "Sistem hatası oluştu. Lütfen tekrar deneyin.";

export function getOpenAIErrorMessage(error: { status?: number } | null | undefined, fallbackMessage: string) {
  if (error?.status === 429) {
    return GENERIC_AI_ERROR_MESSAGE;
  }

  return fallbackMessage;
}
