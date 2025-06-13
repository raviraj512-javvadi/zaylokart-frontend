// The NEW and CORRECT content for frontend/src/api/client.js

// This function handles GET requests
export const get = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

// This function handles POST requests
export const post = async (path, data) => {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};