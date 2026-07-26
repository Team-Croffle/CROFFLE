export interface EventApi {
  emit(eventName: string, ...args: unknown[]): void;
  on(eventName: string, callback: (...args: unknown[]) => void): () => void;
}
