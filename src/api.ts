import axios from "axios";

function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

async function getToken() {
  if (typeof window !== "undefined") {
    return getCookie("accessToken");
  }
  const { cookies } = await import("next/headers");
  return cookies().get("accessToken")?.value;
}

export async function fetchData() {
  const token = await getToken();
  console.log("token", token);
  if (!token) {
    return {
      data: null,
      error: "No token found",
    };
  }
  try {
    const response = await axios.get("http://localhost:5000/api/data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return {
      data: response.data.message,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: String(error),
    };
  }
}
