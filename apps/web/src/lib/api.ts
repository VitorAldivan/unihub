/**
 * Cliente HTTP para a API do UniHub (FastAPI).
 * Gerencia comunicação de rede com fallback gracioso.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export interface ApiCourse {
  id: number;
  user_email: string;
  name: string;
  teacher: string | null;
  room: string | null;
  semester: string;
  weekdays: number[];
  start_time: string;
  end_time: string;
  workload_hours: number;
  total_classes: number | null;
  min_attendance_pct: number;
  color: string;
  total_sessions: number;
  held_sessions: number;
  absences: number;
  absence_limit: number;
  remaining_absences: number;
  current_attendance_pct: number;
  projected_attendance_pct: number;
  status: "SAFE" | "WARNING" | "CRITICAL";
}

export interface ApiCreateCoursePayload {
  user_email: string;
  name: string;
  teacher?: string | null;
  room?: string | null;
  semester?: string;
  weekdays?: number[];
  start_time?: string;
  end_time?: string;
  workload_hours?: number;
  total_classes?: number | null;
  min_attendance_pct?: number;
  color?: string;
}

export interface ApiSimulatePayload {
  total_sessions: number;
  held_sessions: number;
  current_absences: number;
  additional_absences: number;
  min_attendance_pct?: number;
}

export interface ApiSimulateResponse {
  additional_absences: number;
  new_total_absences: number;
  new_remaining_absences: number;
  new_projected_attendance_pct: number;
  new_status: "SAFE" | "WARNING" | "CRITICAL";
  message: string;
}

export interface ApiAuthUser {
  id: number;
  name: string;
  email: string;
}

export interface ApiAuthResponse {
  message: string;
  user: ApiAuthUser;
}

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

async function requestWithDetails<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = json?.detail || json?.message || `Erro ${res.status}`;
      return { data: null, error: errorMsg };
    }

    return { data: json as T };
  } catch (err: any) {
    console.warn(`Falha na requisição API (${endpoint}):`, err);
    return { data: null, error: "Servidor indisponível ou offline." };
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const result = await requestWithDetails<T>(endpoint, options);
  return result.data;
}

export const api = {
  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health/live`, { method: "GET" });
      return res.ok;
    } catch {
      return false;
    }
  },

  auth: {
    register(payload: { name: string; email: string; password: string }): Promise<ApiResponse<ApiAuthResponse>> {
      return requestWithDetails<ApiAuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    login(payload: { email: string; password: string }): Promise<ApiResponse<ApiAuthResponse>> {
      return requestWithDetails<ApiAuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    forgotPassword(email: string): Promise<ApiResponse<{ message: string; exists: boolean }>> {
      return requestWithDetails<{ message: string; exists: boolean }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
  },

  courses: {
    list(userEmail?: string, semester?: string): Promise<ApiCourse[] | null> {
      const params = new URLSearchParams();
      if (userEmail) params.append("user_email", userEmail);
      if (semester) params.append("semester", semester);
      const query = params.toString() ? `?${params.toString()}` : "";
      return request<ApiCourse[]>(`/api/v1/courses/${query}`);
    },

    create(payload: ApiCreateCoursePayload): Promise<ApiCourse | null> {
      return request<ApiCourse>("/api/v1/courses/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    markAttendance(sessionId: number, status: string, note?: string) {
      return request<{ message: string; session_id: number; status: string }>(
        "/api/v1/courses/attendance",
        {
          method: "POST",
          body: JSON.stringify({ session_id: sessionId, status, note }),
        }
      );
    },
  },

  attendance: {
    simulate(payload: ApiSimulatePayload): Promise<ApiSimulateResponse | null> {
      return request<ApiSimulateResponse>("/api/v1/attendance/simulate", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  },
};
