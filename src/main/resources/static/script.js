// ============================================================
// MINDVAULT AI - COMPLETE SCRIPT.JS
// ============================================================


// ============================================================
// AUTHENTICATION HELPERS
// ============================================================

function getToken() {
    return localStorage.getItem("jwtToken");
}


function saveToken(token) {
    localStorage.setItem("jwtToken", token);
}


function logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "/index.html";
}


// ============================================================
// AUTHENTICATED FETCH
// ============================================================

async function authenticatedFetch(url, options = {}) {

    const token = getToken();

    if (!token) {
        window.location.href = "/login.html";
        return null;
    }

    const headers = {
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}`
    };

    // Add JSON content type when sending JSON
    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    options.headers = headers;

    try {

        const response = await fetch(url, options);

        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("jwtToken");

            window.location.href = "/login.html";

            return null;
        }

        return response;

    } catch (error) {

        console.error("Network error:", error);

        throw error;
    }
}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// LOGOUT BUTTON
// ============================================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        logout();

    });
}


// ============================================================
// REGISTER
// ============================================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("registerMessage");

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

                const text = await response.text();

                let data = {};

                try {
                    data = text ? JSON.parse(text) : {};
                } catch {
                    data = {};
                }

                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        data.error ||
                        text ||
                        "Registration failed.";

                    return;
                }

                message.textContent =
                    "Account created successfully! Redirecting to login...";

                registerForm.reset();

                setTimeout(function () {

                    window.location.href = "/login.html";

                }, 1200);

            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                message.textContent =
                    "Unable to connect to server.";
            }
        }
    );
}


// ============================================================
// LOGIN
// ============================================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("loginMessage");

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

                const text = await response.text();

                let data = {};

                try {
                    data = text ? JSON.parse(text) : {};
                } catch {
                    data = {};
                }

                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        data.error ||
                        text ||
                        "Invalid email or password.";

                    return;
                }

                const token =
                    data.token ||
                    data.jwt ||
                    data.accessToken;

                if (!token) {

                    console.error(
                        "Login response:",
                        data
                    );

                    message.textContent =
                        "Login successful, but JWT token was not received.";

                    return;
                }

                saveToken(token);

                message.textContent =
                    "Login successful! Redirecting...";

                setTimeout(function () {

                    window.location.href =
                        "/dashboard.html";

                }, 500);

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                message.textContent =
                    "Unable to connect to server.";
            }
        }
    );
}


// ============================================================
// DASHBOARD AUTH CHECK
// ============================================================

if (
    window.location.pathname === "/dashboard.html"
) {

    if (!getToken()) {

        window.location.href = "/login.html";
    }
}


// ============================================================
// DASHBOARD NAVIGATION
// ============================================================

const notesBtn =
    document.getElementById("notesBtn");

if (notesBtn) {

    notesBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "/notes.html";

        }
    );
}


const collectionsBtn =
    document.getElementById("collectionsBtn");

if (collectionsBtn) {

    collectionsBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "/collections.html";

        }
    );
}


const documentsBtn =
    document.getElementById("documentsBtn");

if (documentsBtn) {

    documentsBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "/documents.html";

        }
    );
}


const aiBtn =
    document.getElementById("aiBtn");

if (aiBtn) {

    aiBtn.addEventListener(
        "click",
        function () {

            alert(
                "AI Assistant will be available in the next module."
            );

        }
    );
}


// ============================================================
// NOTES
// ============================================================


// Load all notes
async function loadNotes() {

    const container =
        document.getElementById("notesContainer");

    if (!container) {
        return;
    }

    container.innerHTML =
        "<p>Loading notes...</p>";

    try {

        const response =
            await authenticatedFetch("/api/notes");

        if (!response) {
            return;
        }

        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text || "Failed to load notes"
            );
        }

        const notes =
            await response.json();

        displayNotes(notes);

    } catch (error) {

        console.error(
            "Load notes error:",
            error
        );

        container.innerHTML =
            `<p>Unable to load notes: ${escapeHtml(error.message)}</p>`;
    }
}


// Display notes
function displayNotes(notes) {

    const container =
        document.getElementById("notesContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!notes || notes.length === 0) {

        container.innerHTML =
            "<p>No notes found.</p>";

        return;
    }

    notes.forEach(function (note) {

        const card =
            document.createElement("div");

        card.className =
            "dashboard-card";

        card.innerHTML = `

            <h3>
                📝 ${escapeHtml(note.title)}
            </h3>

            <p>
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

            <div>

                <button
                    onclick="editNote(${note.id})">
                    ✏️ Edit
                </button>

                <button
                    onclick="deleteNote(${note.id})">
                    🗑️ Delete
                </button>

            </div>
        `;

        container.appendChild(card);
    });
}


// Create note
const noteForm =
    document.getElementById("noteForm");

if (noteForm) {

    noteForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const title =
                document.getElementById("noteTitle")
                    .value.trim();

            const content =
                document.getElementById("noteContent")
                    .value.trim();

            const category =
                document.getElementById("noteCategory")
                    .value.trim();

            const tags =
                document.getElementById("noteTags")
                    .value.trim();

            const collectionInput =
                document.getElementById("noteCollectionId");

            let collectionId = null;

            if (
                collectionInput &&
                collectionInput.value.trim() !== ""
            ) {

                collectionId =
                    Number(collectionInput.value);
            }

            const message =
                document.getElementById("noteMessage");

            try {

                const response =
                    await authenticatedFetch(
                        "/api/notes",
                        {
                            method: "POST",

                            body: JSON.stringify({
                                title: title,
                                content: content,
                                category: category,
                                tags: tags,
                                collectionId: collectionId
                            })
                        }
                    );

                if (!response) {
                    return;
                }

                const text =
                    await response.text();

                let data = {};

                try {
                    data = text ? JSON.parse(text) : {};
                } catch {
                    data = {};
                }

                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        data.error ||
                        text ||
                        "Failed to create note.";

                    return;
                }

                message.textContent =
                    "Note created successfully!";

                noteForm.reset();

                await loadNotes();

            } catch (error) {

                console.error(
                    "Create note error:",
                    error
                );

                message.textContent =
                    error.message ||
                    "Unable to create note.";
            }
        }
    );
}


// Search notes
const searchNotesBtn =
    document.getElementById("searchNotesBtn");

if (searchNotesBtn) {

    searchNotesBtn.addEventListener(
        "click",
        async function () {

            const keyword =
                document.getElementById("noteSearch")
                    .value.trim();

            if (!keyword) {

                await loadNotes();

                return;
            }

            const container =
                document.getElementById(
                    "notesContainer"
                );

            try {

                const response =
                    await authenticatedFetch(
                        `/api/notes/search?keyword=${encodeURIComponent(keyword)}`
                    );

                if (!response) {
                    return;
                }

                if (!response.ok) {

                    throw new Error(
                        "Search failed"
                    );
                }

                const notes =
                    await response.json();

                displayNotes(notes);

            } catch (error) {

                console.error(
                    "Search notes error:",
                    error
                );

                container.innerHTML =
                    "<p>Unable to search notes.</p>";
            }
        }
    );
}


// Show all notes
const showAllNotesBtn =
    document.getElementById(
        "showAllNotesBtn"
    );

if (showAllNotesBtn) {

    showAllNotesBtn.addEventListener(
        "click",
        function () {

            loadNotes();

        }
    );
}


// Delete note
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
                `/api/notes/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response) {
            return;
        }

        const text =
            await response.text();

        if (!response.ok) {

            alert(
                text ||
                "Failed to delete note."
            );

            return;
        }

        alert(
            "Note deleted successfully."
        );

        await loadNotes();

    } catch (error) {

        console.error(
            "Delete note error:",
            error
        );

        alert(
            "Unable to delete note."
        );
    }
}


// Edit note
async function editNote(id) {

    try {

        const response =
            await authenticatedFetch(
                `/api/notes/${id}`
            );

        if (!response) {
            return;
        }

        if (!response.ok) {

            throw new Error(
                "Unable to load note."
            );
        }

        const note =
            await response.json();

        const title =
            prompt(
                "Enter note title:",
                note.title
            );

        if (title === null) {
            return;
        }

        const content =
            prompt(
                "Enter note content:",
                note.content
            );

        if (content === null) {
            return;
        }

        const category =
            prompt(
                "Enter category:",
                note.category || ""
            );

        if (category === null) {
            return;
        }

        const tags =
            prompt(
                "Enter tags:",
                note.tags || ""
            );

        if (tags === null) {
            return;
        }

        const collectionIdInput =
            prompt(
                "Enter collection ID (leave empty for none):",
                note.collectionId || ""
            );

        if (collectionIdInput === null) {
            return;
        }

        let collectionId = null;

        if (
            collectionIdInput.trim() !== ""
        ) {

            collectionId =
                Number(collectionIdInput);
        }

        const updateResponse =
            await authenticatedFetch(
                `/api/notes/${id}`,
                {
                    method: "PUT",

                    body: JSON.stringify({
                        title: title.trim(),
                        content: content.trim(),
                        category: category.trim(),
                        tags: tags.trim(),
                        collectionId: collectionId
                    })
                }
            );

        if (!updateResponse) {
            return;
        }

        const text =
            await updateResponse.text();

        let data = {};

        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            data = {};
        }

        if (!updateResponse.ok) {

            alert(
                data.message ||
                data.error ||
                text ||
                "Failed to update note."
            );

            return;
        }

        alert(
            "Note updated successfully."
        );

        await loadNotes();

    } catch (error) {

        console.error(
            "Edit note error:",
            error
        );

        alert(
            error.message ||
            "Unable to edit note."
        );
    }
}


// ============================================================
// NOTES PAGE INITIALIZATION
// ============================================================

if (
    window.location.pathname === "/notes.html"
) {

    if (!getToken()) {

        window.location.href = "/login.html";

    } else {

        loadCollectionsForNotes();

        loadNotes();
    }
}


// ============================================================
// COLLECTIONS
// ============================================================


// Load collections
async function loadCollections() {

    const container =
        document.getElementById(
            "collectionsContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        "<p>Loading collections...</p>";

    try {

        const response =
            await authenticatedFetch(
                "/api/collections"
            );

        if (!response) {
            return;
        }

        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text ||
                "Failed to load collections."
            );
        }

        const collections =
            await response.json();

        displayCollections(
            collections
        );

    } catch (error) {

        console.error(
            "Load collections error:",
            error
        );

        container.innerHTML =
            `<p>Unable to load collections: ${escapeHtml(error.message)}</p>`;
    }
}


// Display collections
function displayCollections(
    collections
) {

    const container =
        document.getElementById(
            "collectionsContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !collections ||
        collections.length === 0
    ) {

        container.innerHTML =
            "<p>No collections found. Create your first collection!</p>";

        return;
    }

    collections.forEach(
        function (collection) {

            const card =
                document.createElement("div");

            card.className =
                "dashboard-card";

            card.innerHTML = `

                <h3>
                    📁 ${escapeHtml(collection.name)}
                </h3>

                <p>
                    ${escapeHtml(
                        collection.description ||
                        "No description"
                    )}
                </p>

                <p>
                    <strong>ID:</strong>
                    ${collection.id}
                </p>

                <div>

                    <button
                        onclick="editCollection(${collection.id})">
                        ✏️ Edit
                    </button>

                    <button
                        onclick="deleteCollection(${collection.id})">
                        🗑️ Delete
                    </button>

                </div>
            `;

            container.appendChild(card);
        }
    );
}


// Create collection
const collectionForm =
    document.getElementById(
        "collectionForm"
    );

if (collectionForm) {

    collectionForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "collectionName"
                ).value.trim();

            const description =
                document.getElementById(
                    "collectionDescription"
                ).value.trim();

            const message =
                document.getElementById(
                    "collectionMessage"
                );

            if (!name) {

                message.textContent =
                    "Collection name is required.";

                return;
            }

            try {

                const response =
                    await authenticatedFetch(
                        "/api/collections",
                        {
                            method: "POST",

                            body: JSON.stringify({
                                name: name,
                                description: description
                            })
                        }
                    );

                if (!response) {
                    return;
                }

                const text =
                    await response.text();

                let data = {};

                try {
                    data = text ? JSON.parse(text) : {};
                } catch {
                    data = {};
                }

                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        data.error ||
                        text ||
                        `Failed to create collection (${response.status})`;

                    return;
                }

                message.textContent =
                    "Collection created successfully!";

                collectionForm.reset();

                await loadCollections();

            } catch (error) {

                console.error(
                    "Create collection error:",
                    error
                );

                message.textContent =
                    error.message ||
                    "Unable to create collection.";
            }
        }
    );
}


// Edit collection
async function editCollection(id) {

    try {

        const response =
            await authenticatedFetch(
                `/api/collections/${id}`
            );

        if (!response) {
            return;
        }

        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text ||
                "Unable to get collection."
            );
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

        if (!newName.trim()) {

            alert(
                "Collection name cannot be empty."
            );

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
                        name: newName.trim(),
                        description:
                            newDescription.trim()
                    })
                }
            );

        if (!updateResponse) {
            return;
        }

        const text =
            await updateResponse.text();

        let data = {};

        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            data = {};
        }

        if (!updateResponse.ok) {

            alert(
                data.message ||
                data.error ||
                text ||
                "Failed to update collection."
            );

            return;
        }

        alert(
            "Collection updated successfully."
        );

        await loadCollections();

    } catch (error) {

        console.error(
            "Edit collection error:",
            error
        );

        alert(
            error.message ||
            "Unable to edit collection."
        );
    }
}


// Delete collection
async function deleteCollection(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this collection?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await authenticatedFetch(
                `/api/collections/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response) {
            return;
        }

        const text =
            await response.text();

        if (!response.ok) {

            alert(
                text ||
                "Failed to delete collection."
            );

            return;
        }

        alert(
            "Collection deleted successfully."
        );

        await loadCollections();

    } catch (error) {

        console.error(
            "Delete collection error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete collection."
        );
    }
}


// Search collections
async function searchCollections() {

    const searchInput =
        document.getElementById(
            "collectionSearch"
        );

    const container =
        document.getElementById(
            "collectionsContainer"
        );

    if (!searchInput || !container) {
        return;
    }

    const keyword =
        searchInput.value.trim();

    if (!keyword) {

        await loadCollections();

        return;
    }

    try {

        const response =
            await authenticatedFetch(
                `/api/collections/search?keyword=${encodeURIComponent(keyword)}`
            );

        if (!response) {
            return;
        }

        if (!response.ok) {

            throw new Error(
                "Collection search failed."
            );
        }

        const collections =
            await response.json();

        displayCollections(
            collections
        );

    } catch (error) {

        console.error(
            "Search collections error:",
            error
        );

        container.innerHTML =
            "<p>Unable to search collections.</p>";
    }
}


// Search button
const searchCollectionsBtn =
    document.getElementById(
        "searchCollectionsBtn"
    );

if (searchCollectionsBtn) {

    searchCollectionsBtn.addEventListener(
        "click",
        function () {

            searchCollections();

        }
    );
}


// Show all collections
const showAllCollectionsBtn =
    document.getElementById(
        "showAllCollectionsBtn"
    );

if (showAllCollectionsBtn) {

    showAllCollectionsBtn.addEventListener(
        "click",
        function () {

            loadCollections();

        }
    );
}


// Load collections page
if (
    window.location.pathname ===
    "/collections.html"
) {

    if (!getToken()) {

        window.location.href =
            "/login.html";

    } else {

        loadCollections();
    }
}
// ============================================================
// LOAD COLLECTIONS INTO NOTES DROPDOWN
// ============================================================

async function loadCollectionsForNotes() {

    const select =
        document.getElementById("noteCollectionId");

    if (!select) {
        return;
    }

    try {

        const response =
            await authenticatedFetch(
                "/api/collections"
            );

        if (!response) {
            return;
        }

        if (!response.ok) {

            throw new Error(
                "Unable to load collections."
            );
        }

        const collections =
            await response.json();


        // Keep "No Collection"
        select.innerHTML = `
            <option value="">
                No Collection
            </option>
        `;


        collections.forEach(
            function (collection) {

                const option =
                    document.createElement("option");

                option.value =
                    collection.id;

                option.textContent =
                    collection.name;

                select.appendChild(option);
            }
        );

    } catch (error) {

        console.error(
            "Loading collections for notes failed:",
            error
        );

        select.innerHTML = `
            <option value="">
                Unable to load collections
            </option>
        `;
    }
}

// =====================================================
// DOCUMENTS
// =====================================================

async function loadDocuments() {

    const container =
        document.getElementById("documentsContainer");

    if (!container) {
        return;
    }

    container.innerHTML =
        "<p>Loading documents...</p>";

    try {

        const response =
            await authenticatedFetch("/api/documents");

        if (!response) {
            return;
        }

        if (!response.ok) {

            throw new Error(
                "Unable to load documents."
            );
        }

        const documents =
            await response.json();

        displayDocuments(documents);

    } catch (error) {

        console.error(
            "Loading documents failed:",
            error
        );

        container.innerHTML =
            `<p>${escapeHtml(error.message)}</p>`;
    }
}


function displayDocuments(documents) {

    const container =
        document.getElementById("documentsContainer");

    if (!container) {
        return;
    }

    if (!documents || documents.length === 0) {

        container.innerHTML =
            "<p>No documents found.</p>";

        return;
    }


    container.innerHTML = "";


    documents.forEach(function (document) {

        const card =
            document.createElement("div");

        card.className = "note-card";


        card.innerHTML = `

            <div>

                <h3>
                    📄 ${escapeHtml(
                        document.fileName ||
                        document.filename ||
                        "Unnamed Document"
                    )}
                </h3>

                ${
                    document.id
                        ? `<p>Document ID: ${document.id}</p>`
                        : ""
                }

            </div>


            <div class="note-actions">

                <button
                    type="button"
                    onclick="downloadDocument(${document.id})">
                    ⬇ Download
                </button>

                <button
                    type="button"
                    onclick="deleteDocument(${document.id})">
                    🗑 Delete
                </button>

            </div>
        `;


        container.appendChild(card);

    });
}


// =====================================================
// UPLOAD DOCUMENT
// =====================================================

async function uploadDocument(event) {

    event.preventDefault();


    const fileInput =
        document.getElementById("documentFile");

    const message =
        document.getElementById("documentMessage");


    if (!fileInput || !fileInput.files.length) {

        message.textContent =
            "Please select a document.";

        return;
    }


    const file =
        fileInput.files[0];


    const formData =
        new FormData();

    formData.append("file", file);


    try {

        message.textContent =
            "Uploading document...";


        const token =
            getToken();


        const response =
            await fetch("/api/documents", {

                method: "POST",

                headers: {

                    "Authorization":
                        "Bearer " + token

                },

                body: formData

            });


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Document upload failed."
            );
        }


        message.textContent =
            "Document uploaded successfully.";


        fileInput.value = "";


        await loadDocuments();


    } catch (error) {

        console.error(
            "Document upload failed:",
            error
        );

        message.textContent =
            error.message ||
            "Document upload failed.";
    }
}


// =====================================================
// SEARCH DOCUMENTS
// =====================================================

async function searchDocuments() {

    const searchInput =
        document.getElementById("documentSearch");

    if (!searchInput) {
        return;
    }


    const keyword =
        searchInput.value.trim();


    if (keyword === "") {

        await loadDocuments();

        return;
    }


    try {

        const response =
            await authenticatedFetch(
                "/api/documents/search?keyword=" +
                encodeURIComponent(keyword)
            );


        if (!response) {
            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to search documents."
            );
        }


        const documents =
            await response.json();


        displayDocuments(documents);


    } catch (error) {

        console.error(
            "Document search failed:",
            error
        );

        const container =
            document.getElementById(
                "documentsContainer"
            );

        container.innerHTML =
            `<p>${escapeHtml(error.message)}</p>`;
    }
}


// =====================================================
// DOWNLOAD DOCUMENT
// =====================================================

async function downloadDocument(id) {

    try {

        const token =
            getToken();


        const response =
            await fetch(
                "/api/documents/" + id + "/download",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to download document."
            );
        }


        const blob =
            await response.blob();


        const url =
            window.URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;


        /*
         * Try to get filename from
         * Content-Disposition header.
         */

        const disposition =
            response.headers.get(
                "Content-Disposition"
            );


        let filename =
            "document";


        if (disposition) {

            const match =
                disposition.match(
                    /filename="?([^"]+)"?/
                );


            if (match && match[1]) {

                filename =
                    match[1];

            }
        }


        link.download =
            filename;


        document.body.appendChild(link);


        link.click();


        link.remove();


        window.URL.revokeObjectURL(url);


    } catch (error) {

        console.error(
            "Document download failed:",
            error
        );

        alert(
            error.message ||
            "Unable to download document."
        );
    }
}


// =====================================================
// DELETE DOCUMENT
// =====================================================

async function deleteDocument(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this document?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await authenticatedFetch(
                "/api/documents/" + id,
                {
                    method: "DELETE"
                }
            );


        if (!response) {
            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Unable to delete document."
            );
        }


        await loadDocuments();


    } catch (error) {

        console.error(
            "Document deletion failed:",
            error
        );

        alert(
            error.message ||
            "Unable to delete document."
        );
    }
}


// =====================================================
// DOCUMENT PAGE INITIALIZATION
// =====================================================

if (
    window.location.pathname ===
    "/documents.html"
) {

    if (!getToken()) {

        window.location.href =
            "/login.html";

    } else {

        loadDocuments();


        const uploadForm =
            document.getElementById(
                "documentUploadForm"
            );


        if (uploadForm) {

            uploadForm.addEventListener(
                "submit",
                uploadDocument
            );

        }


        const searchButton =
            document.getElementById(
                "searchDocumentsBtn"
            );


        if (searchButton) {

            searchButton.addEventListener(
                "click",
                searchDocuments
            );

        }


        const showAllButton =
            document.getElementById(
                "showAllDocumentsBtn"
            );


        if (showAllButton) {

            showAllButton.addEventListener(
                "click",
                loadDocuments
            );

        }

    }
}