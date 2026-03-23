export async function getTasks() {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Fetch /api/tasks failed");
  return res.text(); // backend đang trả text
}