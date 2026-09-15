/*
*/
export async function getTasks ({ currentPage, pageSize, search, completedFilter, sort, order }) {
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

    const url = `http://localhost:3000/tasks?${urlParams}`;
    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    const data = await response.json();
    return data;
}

/*
*/
export async function addTask (title, description) {
    // Send the new task to the backend (POST request)
    const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
}

/* 
*/
export async function deleteTask (id) {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
}

/*
*/
export async function toggleTaskCompletion (id, completed) {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
}

/*
*/
export async function editTask (id, newTitle, newDescription) {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: newTitle, description: newDescription })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
}