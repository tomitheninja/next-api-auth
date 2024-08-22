"use client";
import { fetchData } from "@/api";
import { useState } from "react";

export function ClientFetch() {
  const [state, setState] = useState < {data: any, error: any}
| null >(null);

  function onClick() {
    fetchData().then(({ data, error }) => {
      setState({ data, error });
    });
  }

  // useEffect(() => {
  //   onClick();
  // }, []);

  return (
    <>
    <button className="border-2" onClick={() => onClick()}>Fetch data</button>
      {state?.error ? (<div className="text-red-500 p-2 border-red-500 border-2">{state.error}</div>) : null}
      {state?.data ? <p>{state.data}</p> : null}
    </>
  );
}
