export type HttpResponse<T = unknown> = {
  ok: boolean;
  status: number;
  data: T | null;
};
