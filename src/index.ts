export function add(a: number, b: number): number {
  return a + b;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const greeting = process.env.APP_GREETING ?? "Hello from default";
  const result = add(2, 3);
  console.log(`${greeting}. 2 + 3 = ${result}`);
}
