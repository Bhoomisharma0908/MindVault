// ======================================================
// MINDVAULT AI - COMPLETE SCRIPT
// ======================================================


// ======================================================
// HELPER: GET JWT
// ======================================================

function getToken() {
    return localStorage.getItem("jwtToken");
}


// ======================================================
// REGISTER
// ======================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document
            .getElementById("registerName")
            .value
            .trim();

        const email = document
            .getElementById("registerEmail")
            .value
            .trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");


        // -----------------------------
        // Validation
        // -----------------------------

        if (!name || !email || !password || !confirmPassword) {

            message.textContent =
                "Please fill in all fields.";

            return;
        }


        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        try {

            const response = await fetch(
                "/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            let data = {};

            try {
                data = await response.json();
            } catch (error) {
                data = {};
            }


            console.log("Register response:", data);


            if (response.ok) {

                message.textContent =
                    "Account created successfully! Please login.";

                message.style.color = "green";


                // IMPORTANT:
                // Registration does NOT automatically
                // log the user into the dashboard.

                setTimeout(function () {

                    window.location.href =
                        "/login.html";

                }, 1200);


            } else {

                message.textContent =
                    data.message ||
                    data.error ||
                    "Registration failed.";

                message.style.color = "red";

            }


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            message.textContent =
                "Unable to connect to server.";

            message.style.color = "red";

        }

    });

}



// ======================================================
// LOGIN
// ======================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail")
                .value
                .trim();

        const password =
            document.getElementById("loginPassword")
                .value;

        const message =
            document.getElementById("loginMessage");


        if (!email || !password) {

            message.textContent =
                "Please enter email and password.";

            return;
        }


        try {

            const response = await fetch(
                "/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            let data = {};

            try {
                data = await response.json();
            } catch (error) {
                data = {};
            }


            console.log("Login response:", data);


            if (response.ok) {

                const token =
                    data.token ||
                    data.jwt ||
                    data.accessToken;


                if (!token) {

                    message.textContent =
                        "Login successful, but JWT token was not received.";

                    return;
                }


                // Store JWT only after successful login

                localStorage.setItem(
                    "jwtToken",
                    token
                );


                message.textContent =
                    "Login successful! Opening dashboard...";

                message.style.color = "green";


                setTimeout(function () {

                    window.location.href =
                        "/dashboard.html";

                }, 700);


            } else {

                message.textContent =
                    data.message ||
                    data.error ||
                    "Invalid email or password.";

                message.style.color = "red";

            }


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            message.textContent =
                "Unable to connect to server.";

            message.style.color = "red";

        }

    });

}



// ======================================================
// LOGOUT
// ======================================================

const logoutButton =
    document.getElementById("logoutBtn");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem("jwtToken");

            window.location.href =
                "/index.html";

        }
    );

}



// ======================================================
// DASHBOARD PROTECTION
// ======================================================

const currentPage =
    window.location.pathname;


if (
    currentPage.endsWith("/dashboard.html")
) {

    const token = getToken();


    // No JWT = user is not logged in

    if (!token) {

        window.location.href =
            "/login.html";

    }

}



// ======================================================
// NOTES BUTTON
// ======================================================

const notesButton =
    document.getElementById("notesBtn");

if (notesButton) {

    notesButton.addEventListener(
        "click",
        function () {

            if (!getToken()) {

                window.location.href =
                    "/login.html";

                return;
            }


            window.location.href =
                "/notes.html";

        }
    );

}



// ======================================================
// COLLECTIONS BUTTON
// ======================================================

const collectionsButton =
    document.getElementById("collectionsBtn");

if (collectionsButton) {

    collectionsButton.addEventListener(
        "click",
        function () {

            if (!getToken()) {

                window.location.href =
                    "/login.html";

                return;
            }


            window.location.href =
                "/collections.html";

        }
    );

}



// ======================================================
// DOCUMENTS BUTTON
// ======================================================

const documentsButton =
    document.getElementById("documentsBtn");

if (documentsButton) {

    documentsButton.addEventListener(
        "click",
        function () {

            if (!getToken()) {

                window.location.href =
                    "/login.html";

                return;
            }


            window.location.href =
                "/documents.html";

        }
    );

}



// ======================================================
// AI ASSISTANT
// ======================================================

const aiButton =
    document.getElementById("aiBtn");

if (aiButton) {

    aiButton.addEventListener(
        "click",
        function () {

            alert(
                "AI Assistant feature is coming soon."
            );

        }
    );

}
// ======================================================
// NOTES
// ======================================================

const noteForm = document.getElementById("noteForm");

const notesContainer =
    document.getElementById("notesContainer");


// ======================================================
// LOAD ALL NOTES
// ======================================================

async function loadNotes() {

    try {

        const response =
            await authenticatedFetch("/api/notes");

        if (!response) {
            return;
        }

        if (!response.ok) {

            notesContainer.innerHTML =
                "<p>Unable to load notes.</p>";

            return;
        }


        const notes = await response.json();

        displayNotes(notes);


    } catch (error) {

        console.error("Load notes error:", error);

        notesContainer.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}


// ======================================================
// DISPLAY NOTES
// ======================================================

function displayNotes(notes) {

    if (!notes || notes.length === 0) {

        notesContainer.innerHTML =
            "<p>No notes found. Create your first note!</p>";

        return;
    }


    notesContainer.innerHTML = "";


    notes.forEach(function (note) {

        const noteCard =
            document.createElement("div");

        noteCard.className = "note-card";


        noteCard.innerHTML = `

            <h3>${escapeHtml(note.title)}</h3>

            <p class="note-content">
                ${escapeHtml(note.content)}
            </p>

            <p>
                <strong>Category:</strong>
                ${escapeHtml(note.category || "None")}
            </p>

            <p>
                <strong>Tags:</strong>
                ${escapeHtml(note.tags || "None")}
            </p>

            <p>
                <strong>Collection:</strong>
                ${note.collectionId || "None"}
            </p>

            <div class="note-actions">

                <button
                    onclick="editNote(${note.id})">
                    Edit
                </button>

                <button
                    onclick="deleteNote(${note.id})">
                    Delete
                </button>

            </div>

        `;


        notesContainer.appendChild(noteCard);

    });
}


// ======================================================
// CREATE NOTE
// ======================================================

if (noteForm) {

    noteForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const title =
                document.getElementById("noteTitle")
                    .value
                    .trim();

            const content =
                document.getElementById("noteContent")
                    .value
                    .trim();

            const category =
                document.getElementById("noteCategory")
                    .value
                    .trim();

            const tags =
                document.getElementById("noteTags")
                    .value
                    .trim();

            const collectionValue =
                document.getElementById("noteCollectionId")
                    .value
                    .trim();


            const noteMessage =
                document.getElementById("noteMessage");


            const noteData = {

                title: title,

                content: content,

                category: category,

                tags: tags

            };


            // Only send collectionId if entered

            if (collectionValue) {

                noteData.collectionId =
                    Number(collectionValue);

            }


            try {

                const response =
                    await authenticatedFetch(
                        "/api/notes",
                        {
                            method: "POST",

                            body: JSON.stringify(noteData)
                        }
                    );


                if (!response) {
                    return;
                }


                const data =
                    await response.json();


                if (response.ok) {

                    noteMessage.textContent =
                        "Note created successfully!";

                    noteMessage.style.color =
                        "green";


                    noteForm.reset();


                    // Refresh notes

                    loadNotes();


                } else {

                    noteMessage.textContent =
                        data.message ||
                        data.error ||
                        "Unable to create note.";

                    noteMessage.style.color =
                        "red";
                }


            } catch (error) {

                console.error(
                    "Create note error:",
                    error
                );

                noteMessage.textContent =
                    "Unable to connect to server.";

            }

        }
    );

}


// ======================================================
// SEARCH NOTES
// ======================================================

const searchNotesBtn =
    document.getElementById("searchNotesBtn");


if (searchNotesBtn) {

    searchNotesBtn.addEventListener(
        "click",
        async function () {

            const keyword =
                document.getElementById("noteSearch")
                    .value
                    .trim();


            if (!keyword) {

                loadNotes();

                return;
            }


            try {

                const response =
                    await authenticatedFetch(
                        "/api/notes/search?keyword=" +
                        encodeURIComponent(keyword)
                    );


                if (!response) {
                    return;
                }


                if (!response.ok) {

                    notesContainer.innerHTML =
                        "<p>Search failed.</p>";

                    return;
                }


                const notes =
                    await response.json();


                displayNotes(notes);


            } catch (error) {

                console.error(
                    "Search error:",
                    error
                );

                notesContainer.innerHTML =
                    "<p>Unable to search notes.</p>";

            }

        }
    );

}


// ======================================================
// SHOW ALL NOTES
// ======================================================

const showAllNotesBtn =
    document.getElementById("showAllNotesBtn");


if (showAllNotesBtn) {

    showAllNotesBtn.addEventListener(
        "click",
        function () {

            document.getElementById("noteSearch")
                .value = "";

            loadNotes();

        }
    );

}


// ======================================================
// DELETE NOTE
// ======================================================

async function deleteNote(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this note?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await authenticatedFetch(
                "/api/notes/" + id,
                {
                    method: "DELETE"
                }
            );


        if (!response) {
            return;
        }


        if (response.ok) {

            alert("Note deleted successfully.");

            loadNotes();

        } else {

            alert("Unable to delete note.");

        }


    } catch (error) {

        console.error(
            "Delete note error:",
            error
        );

        alert("Unable to connect to server.");

    }

}


// ======================================================
// EDIT NOTE
// ======================================================

async function editNote(id) {

    const title =
        prompt("Enter new note title:");


    if (title === null) {
        return;
    }


    const content =
        prompt("Enter new note content:");


    if (content === null) {
        return;
    }


    try {

        // First get existing note

        const getResponse =
            await authenticatedFetch(
                "/api/notes/" + id
            );


        if (!getResponse) {
            return;
        }


        if (!getResponse.ok) {

            alert("Unable to find note.");

            return;
        }


        const existingNote =
            await getResponse.json();


        const updatedNote = {

            title: title,

            content: content,

            category:
                existingNote.category || "",

            tags:
                existingNote.tags || ""

        };


        if (existingNote.collectionId) {

            updatedNote.collectionId =
                existingNote.collectionId;

        }


        const response =
            await authenticatedFetch(
                "/api/notes/" + id,
                {
                    method: "PUT",

                    body:
                        JSON.stringify(updatedNote)
                }
            );


        if (!response) {
            return;
        }


        if (response.ok) {

            alert(
                "Note updated successfully."
            );

            loadNotes();

        } else {

            const data =
                await response.json();

            alert(
                data.message ||
                "Unable to update note."
            );

        }


    } catch (error) {

        console.error(
            "Edit note error:",
            error
        );

        alert("Unable to connect to server.");

    }

}


// ======================================================
// ESCAPE HTML
// Prevent HTML injection when displaying notes
// ======================================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// ======================================================
// LOAD NOTES WHEN notes.html OPENS
// ======================================================

if (
    window.location.pathname.endsWith(
        "/notes.html"
    )
) {

    if (!getToken()) {

        window.location.href =
            "/login.html";

    } else {

        loadNotes();

    }

}
// ======================================================
// COLLECTIONS
// ======================================================

async function loadCollections() {

    try {

        const response = await authenticatedFetch("/api/collections");

        if (!response.ok) {
            throw new Error("Failed to load collections");
        }

        const collections = await response.json();

        displayCollections(collections);

    } catch (error) {

        console.error(error);

        const container = document.getElementById("collectionsContainer");

        if (container) {
            container.innerHTML =
                "<p>Unable to load collections.</p>";
        }
    }
}


// Display collections
function displayCollections(collections) {

    const container =
        document.getElementById("collectionsContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!collections || collections.length === 0) {

        container.innerHTML =
            "<p>No collections found. Create your first collection!</p>";

        return;
    }

    collections.forEach(collection => {

        const card = document.createElement("div");

        card.className = "dashboard-card";

        card.innerHTML = `
            <h3>📁 ${escapeHtml(collection.name)}</h3>

            <p>
                ${escapeHtml(
                    collection.description || "No description"
                )}
            </p>

            <p>
                <strong>ID:</strong> ${collection.id}
            </p>

            <button
                onclick="editCollection(${collection.id})">
                ✏️ Edit
            </button>

            <button
                onclick="deleteCollection(${collection.id})">
                🗑️ Delete
            </button>
        `;

        container.appendChild(card);
    });
}


// Create collection
const collectionForm =
    document.getElementById("collectionForm");

if (collectionForm) {

    collectionForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("collectionName").value.trim();

        const description =
            document.getElementById("collectionDescription").value.trim();

        const message =
            document.getElementById("collectionMessage");

        if (!name) {

            message.textContent =
                "Collection name is required.";

            return;
        }

        try {

            const response = await authenticatedFetch(
                "/api/collections",
                {
                    method: "POST",

                    body: JSON.stringify({
                        name: name,
                        description: description
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                message.textContent =
                    data.message || "Failed to create collection.";

                return;
            }

            message.textContent =
                "Collection created successfully!";

            collectionForm.reset();

            loadCollections();

        } catch (error) {

            console.error(error);

            message.textContent =
                "Something went wrong.";
        }
    });
}


// Delete collection
async function deleteCollection(id) {

    const confirmed =
        confirm("Are you sure you want to delete this collection?");

    if (!confirmed) {
        return;
    }

    try {

        const response = await authenticatedFetch(
            `/api/collections/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {

            alert("Failed to delete collection.");

            return;
        }

        alert("Collection deleted successfully.");

        loadCollections();

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");
    }
}


// Edit collection
async function editCollection(id) {

    try {

        // First get existing collection
        const response =
            await authenticatedFetch(
                `/api/collections/${id}`
            );

        if (!response.ok) {

            alert("Unable to get collection.");

            return;
        }

        const collection =
            await response.json();

        const newName =
            prompt(
                "Enter new collection name:",
                collection.name
            );

        if (newName === null) {
            return;
        }

        const newDescription =
            prompt(
                "Enter new description:",
                collection.description || ""
            );

        if (newDescription === null) {
            return;
        }

        const updateResponse =
            await authenticatedFetch(
                `/api/collections/${id}`,
                {
                    method: "PUT",

                    body: JSON.stringify({
                        name: newName,
                        description: newDescription
                    })
                }
            );

        if (!updateResponse.ok) {

            alert("Failed to update collection.");

            return;
        }

        alert("Collection updated successfully.");

        loadCollections();

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");
    }
}


// Load collections when collections page opens
if (window.location.pathname === "/collections.html") {

    if (!getToken()) {

        window.location.href = "/login.html";

    } else {

        loadCollections();
    }
}