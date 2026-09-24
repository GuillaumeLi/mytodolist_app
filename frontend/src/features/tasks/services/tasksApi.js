const API_BASE_URL = "http://localhost:3000";
const TASKS_URL = `${API_BASE_URL}/tasks`;

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = response.json().catch(() => null);
        throw new Error(errorData?.message ?? "An unexpected error occured");
    }

    return response;
}

export async function getTasks ({ currentPage, pageSize, search, completedFilter, sort, order, signal }) {
    const urlParams = new URLSearchParams();
            
    urlParams.set("page", currentPage);
    urlParams.set("limit", pageSize);
    urlParams.set("sort", sort);
    urlParams.set("order", order);
    if (search) {
        urlParams.set("search", search);
    }
    if (completedFilter) {
        urlParams.set("completed", completedFilter);
    }

    const url = `${TASKS_URL}?${urlParams}`;
    const response = await request(url, { signal });
    
    return response.json();
}

export async function addTask (title, description) {
    await request(TASKS_URL, {
        method: "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({ title, description })
    });
}

export async function deleteTask (id) {
    await request(`${TASKS_URL}/${id}`, { method: "DELETE" });
}

export async function toggleTaskCompletion (id, completed) {
    await request(`${TASKS_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed })
    });
}

export async function editTask (id, title, description) {
    await request(`${TASKS_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title,description })
    })
}