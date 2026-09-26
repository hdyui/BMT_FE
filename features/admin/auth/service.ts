import { apiClient, type ApiEnvelope } from "@/lib/api";
import { ADMIN_AUTH_COOKIE, ADMIN_AUTH_MARKER } from "@/features/admin/lib/auth-config";

export interface AdminLoginInput {
  email: string;
  password: string;
}

export async function loginAdmin(input: AdminLoginInput) {
  const response = await apiClient.post<ApiEnvelope<unknown> | undefined>(
    "/api/v1/auth/login",
    input,
  );

  if (response && "isSuccess" in response && response.isSuccess === false) {
    throw new Error("Email hoặc mật khẩu không đúng.");
  }

  // The real auth cookie is set by the API domain. This same-origin marker
  // only lets Next's local admin proxy know that the login flow succeeded.
  document.cookie = `${ADMIN_AUTH_COOKIE}=${ADMIN_AUTH_MARKER}; Path=/; SameSite=Lax`;

  return response;
}
