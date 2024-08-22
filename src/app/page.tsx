// app/page.js
import React from "react";
import { fetchData } from "@/api"; // Adjust the import path if needed
import { AuthButton } from "./auth-button";
import { ClientFetch } from "./client-fetch";

export const dynamic = true;

export default async function Home() {
  const { data, error } = await fetchData();

  return (
    <div>
      <h1>Client response</h1>
      <ClientFetch />
      <h1>Server response</h1>
      {error ? (
        <div className="text-red-500 p-2 border-red-500 border-2">
          {error}
        </div>
      ) : (
        <div>{data ? <p>{data}</p> : <p>Loading...</p>}</div>
      )}
      <h1>Authentication</h1>
      <div>
        <AuthButton loggedIn={data != null} />
      </div>
    </div>
  );
}
