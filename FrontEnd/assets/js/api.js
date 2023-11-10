// Fetch Works
async function fetchWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    return await response.json();
}

// Fetch Categories
async function fetchCategory () {
    const response = await fetch('http://localhost:5678/api/categories');
    return await response.json();
}

// Fetch Login
async function fetchLogin(data) {

    return fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
}

// Fetch Delete
async function fetchDelete(projectId, token) {
    return fetch(`http://localhost:5678/api/works/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
}

// Fetch Envoie des nouveaux travaux
async function fetchSend(userToken, formData) {
    return fetch('http://localhost:5678/api/works', {

        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userToken}`
        },
        body: formData
    });
}

