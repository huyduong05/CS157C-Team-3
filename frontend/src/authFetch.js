export default function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");           // read once
    return fetch(url, {
      ...options,
      headers: {
        "Authorization": "Bearer " + token,
        ...(options.headers || {}),
      },
    });
  }
  