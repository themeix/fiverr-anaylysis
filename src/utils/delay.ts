export function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function openPageDelay(): Promise<void> {
  return randomDelay(2000, 5000);
}

export function clickDelay(): Promise<void> {
  return randomDelay(1000, 3000);
}

export function showMoreDelay(): Promise<void> {
  return randomDelay(2000, 6000);
}

export function profileDelay(): Promise<void> {
  return randomDelay(3000, 8000);
}

export function clickBreakDelay(): Promise<void> {
  return randomDelay(20000, 60000);
}

export function profileBreakDelay(): Promise<void> {
  return randomDelay(120000, 300000);
}