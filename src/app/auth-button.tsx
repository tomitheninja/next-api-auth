"use client";

import { deleteCookie } from "./actions";

export function AuthButton({ loggedIn }: { loggedIn: boolean }) {
  function logout() {
    localStorage.removeItem("accessToken");
    deleteCookie("accessToken");
  }
  return loggedIn ? (
    <button onClick={() => logout()}>Logout</button>
  ) : (
    <a href="/login">
      <button>Login with AuthSch</button>
    </a>
  );
}
