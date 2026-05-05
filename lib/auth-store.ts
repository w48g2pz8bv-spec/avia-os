export const auth = {
  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("isLoggedIn") === "true";
  },
  login: () => localStorage.setItem("isLoggedIn", "true"),
  logout: () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  },
  isOnboarded: () => localStorage.getItem("onboarded") === "true",
  completeOnboarding: () => localStorage.setItem("onboarded", "true")
};
