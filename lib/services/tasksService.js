import { tasksMock } from '../mocks/tasksMock';

// Phase 1: mock-only service (can be swapped for Supabase later)
export async function listTasks() {
  return tasksMock;
}

