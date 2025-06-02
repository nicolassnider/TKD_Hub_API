export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return true;
    // exp is in seconds, Date.now() is ms
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
