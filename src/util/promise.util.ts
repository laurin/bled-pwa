/**
 * returns a promise that resolves after the specified amount of milliseconds
 * @param duration milliseconds to resolve after
 * @returns 
 */
export function sleep(duration: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
