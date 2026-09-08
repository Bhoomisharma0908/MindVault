// =====================================================
// MINVAULT AI - COMPLETE SCRIPT.JS
// =====================================================


// =====================================================
// AUTHENTICATION HELPERS
// =====================================================

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


// =====================================================
// AUTHENTICATED FETCH
// =====================================================

async function authenticatedFetch(url, options = {}) {

    const token = getToken();

    if (!token) {

        window.location.href = "/login.html";

        return null;
    }


    const headers = options.headers || {};

    headers["Authorization"] =
        "Bearer " + token;


    options.headers = headers;


    const response =
        await fetch(url, options);


    // If JWT is expired or invalid
    if (response.status === 401) {

        localStorage.removeItem("jwtToken");

        window.location.href =
            "/login.html";

        return null;
    }


    return response;
}


// =====================================================
// HTML ESCAPE
// =====================================================

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


// =====================================================
// LOGOUT BUTTON
// =====================================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logout
    );
}


// =====================================================
// REGISTER
// =====================================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById("name")
                    ?.value.trim();


            const email =
                document.getElementById("email")
                    ?.value.trim();


            const password =
                document.getElementById("password")
                    ?.value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            try {

                const response =
                    await fetch(
                        "/api/users/register",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password

                            })

                        }
                    );


                const data =
                    await response.json()
                        .catch(() => ({}));


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.error ||
                        "Registration failed."
                    );
                }


                if (message) {

                    message.textContent =
                        "Registration successful! Redirecting to login...";
                }


                setTimeout(
                    function () {

                        window.location.href =
                            "/login.html";

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message;
                }
            }

        }
    );
}


// =====================================================
// LOGIN
// =====================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById("email")
                    ?.value.trim();


            const password =
                document.getElementById("password")
                    ?.value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            try {

                const response =
                    await fetch(
                        "/api/users/login",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: email,

                                password: password

                            })

                        }
                    );


                const data =
                    await response.json()
                        .catch(() => ({}));


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.error ||
                        "Invalid email or password."
                    );
                }


                /*
                 * Supports different possible
                 * JWT response field names.
                 */

                const token =
                    data.token ||
                    data.jwt ||
                    data.accessToken;


                if (!token) {

                    throw new Error(
                        "JWT token was not returned by the server."
                    );
                }


                saveToken(token);


                if (message) {

                    message.textContent =
                        "Login successful! Redirecting...";
                }


                setTimeout(
                    function () {

                        window.location.href =
                            "/dashboard.html";

                    },
                    500
                );


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message;
                }
            }

        }
    );
}


// =====================================================
// DASHBOARD AUTHENTICATION
// =====================================================

if (
    window.location.pathname ===
    "/dashboard.html"
) {

    if (!getToken()) {

        window.location.href =
            "/login.html";
    }
}


// =====================================================
// DASHBOARD NAVIGATION
// =====================================================

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
    document.getElementById(
        "collectionsBtn"
    );


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
    document.getElementById(
        "documentsBtn"
    );


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
                "AI Assistant will be added in the next phase."
            );

        }
    );
}


// =====================================================
// NOTES
// =====================================================

async function loadNotes() {

    const container =
        document.getElementById(
            "notesContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading notes...</p>";


    try {

        const response =
            await authenticatedFetch(
                "/api/notes"
            );


        if (!response) {
            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to load notes."
            );
        }


        const notes =
            await response.json();


        displayNotes(notes);


    } catch (error) {

        console.error(
            "Loading notes failed:",
            error
        );


        container.innerHTML =
            `<p>${escapeHtml(
                error.message
            )}</p>`;
    }
}


// =====================================================
// DISPLAY NOTES
// =====================================================

function displayNotes(notes) {

    const container =
        document.getElementById(
            "notesContainer"
        );


    if (!container) {
        return;
    }


    if (!notes ||
        notes.length === 0) {

        container.innerHTML =
            "<p>No notes found.</p>";

        return;
    }


    container.innerHTML = "";


    notes.forEach(function (note) {

        const card =
            document.createElement("div");


        card.className =
            "note-card";


        card.innerHTML = `

            <h3>
                ${escapeHtml(note.title)}
            </h3>

            <p>
                ${escapeHtml(note.content)}
            </p>

            <p>
                <strong>Category:</strong>
                ${escapeHtml(note.category)}
            </p>

            <p>
                <strong>Tags:</strong>
                ${escapeHtml(note.tags)}
            </p>

            ${
                note.collectionId
                    ? `
                    <p>
                        <strong>Collection:</strong>
                        ${escapeHtml(
                            note.collectionId
                        )}
                    </p>
                    `
                    : ""
            }

            <div class="note-actions">

                <button
                    type="button"
                    onclick="editNote(${note.id})">
                    ✏ Edit
                </button>

                <button
                    type="button"
                    onclick="deleteNote(${note.id})">
                    🗑 Delete
                </button>

            </div>
        `;


        container.appendChild(card);

    });
}


// =====================================================
// CREATE NOTE
// =====================================================

const noteForm =
    document.getElementById(
        "noteForm"
    );


if (noteForm) {

    noteForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const title =
                document.getElementById(
                    "noteTitle"
                )?.value.trim();


            const content =
                document.getElementById(
                    "noteContent"
                )?.value.trim();


            const category =
                document.getElementById(
                    "noteCategory"
                )?.value.trim();


            const tags =
                document.getElementById(
                    "noteTags"
                )?.value.trim();


            const collectionInput =
                document.getElementById(
                    "noteCollectionId"
                );


            let collectionId = null;


            if (
                collectionInput &&
                collectionInput.value.trim() !== ""
            ) {

                collectionId =
                    Number(
                        collectionInput.value
                    );
            }


            const message =
                document.getElementById(
                    "noteMessage"
                );


            try {

                const response =
                    await authenticatedFetch(
                        "/api/notes",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                title: title,

                                content: content,

                                category: category,

                                tags: tags,

                                collectionId:
                                    collectionId

                            })

                        }
                    );


                if (!response) {
                    return;
                }


                const data =
                    await response.json()
                        .catch(() => ({}));


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.error ||
                        "Unable to create note."
                    );
                }


                if (message) {

                    message.textContent =
                        "Note created successfully.";
                }


                noteForm.reset();


                await loadNotes();


            } catch (error) {

                console.error(
                    "Creating note failed:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message;
                }
            }

        }
    );
}


// =====================================================
// SEARCH NOTES
// =====================================================

async function searchNotes() {

    const searchInput =
        document.getElementById(
            "noteSearch"
        );


    if (!searchInput) {
        return;
    }


    const keyword =
        searchInput.value.trim();


    if (keyword === "") {

        await loadNotes();

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

            throw new Error(
                "Unable to search notes."
            );
        }


        const notes =
            await response.json();


        displayNotes(notes);


    } catch (error) {

        console.error(
            "Note search failed:",
            error
        );


        const container =
            document.getElementById(
                "notesContainer"
            );


        if (container) {

            container.innerHTML =
                `<p>${escapeHtml(
                    error.message
                )}</p>`;
        }
    }
}


// =====================================================
// DELETE NOTE
// =====================================================

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


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                "Unable to delete note."
            );
        }


        await loadNotes();


    } catch (error) {

        console.error(
            "Deleting note failed:",
            error
        );


        alert(
            error.message ||
            "Unable to delete note."
        );
    }
}


// =====================================================
// EDIT NOTE
// =====================================================

async function editNote(id) {

    const newTitle =
        prompt(
            "Enter new note title:"
        );


    if (newTitle === null) {
        return;
    }


    const newContent =
        prompt(
            "Enter new note content:"
        );


    if (newContent === null) {
        return;
    }


    try {

        const getResponse =
            await authenticatedFetch(
                "/api/notes/" + id
            );


        if (!getResponse) {
            return;
        }


        if (!getResponse.ok) {

            throw new Error(
                "Unable to get note."
            );
        }


        const existingNote =
            await getResponse.json();


        const response =
            await authenticatedFetch(
                "/api/notes/" + id,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        title: newTitle,

                        content: newContent,

                        category:
                            existingNote.category,

                        tags:
                            existingNote.tags,

                        collectionId:
                            existingNote.collectionId

                    })

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
                "Unable to update note."
            );
        }


        await loadNotes();


    } catch (error) {

        console.error(
            "Editing note failed:",
            error
        );


        alert(
            error.message ||
            "Unable to update note."
        );
    }
}


// =====================================================
// LOAD COLLECTIONS FOR NOTES DROPDOWN
// =====================================================

async function loadCollectionsForNotes() {

    const select =
        document.getElementById(
            "noteCollectionId"
        );


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


        select.innerHTML = `

            <option value="">
                No Collection
            </option>

        `;


        collections.forEach(
            function (collection) {

                const option =
                    document.createElement(
                        "option"
                    );


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
// NOTES PAGE INITIALIZATION
// =====================================================

if (
    window.location.pathname ===
    "/notes.html"
) {

    if (!getToken()) {

        window.location.href =
            "/login.html";

    } else {

        loadCollectionsForNotes();

        loadNotes();

    }
}


// =====================================================
// COLLECTIONS
// =====================================================

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

            throw new Error(
                "Unable to load collections."
            );
        }


        const collections =
            await response.json();


        displayCollections(
            collections
        );


    } catch (error) {

        console.error(
            "Loading collections failed:",
            error
        );


        container.innerHTML =
            `<p>${escapeHtml(
                error.message
            )}</p>`;
    }
}


// =====================================================
// DISPLAY COLLECTIONS
// =====================================================

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


    if (
        !collections ||
        collections.length === 0
    ) {

        container.innerHTML =
            "<p>No collections found.</p>";

        return;
    }


    container.innerHTML = "";


    collections.forEach(
        function (collection) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "note-card";


            card.innerHTML = `

                <h3>
                    📁 ${escapeHtml(
                        collection.name
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        collection.description
                    )}
                </p>

                <p>
                    <strong>ID:</strong>
                    ${escapeHtml(
                        collection.id
                    )}
                </p>

                <div class="note-actions">

                    <button
                        type="button"
                        onclick="editCollection(${collection.id})">
                        ✏ Edit
                    </button>

                    <button
                        type="button"
                        onclick="deleteCollection(${collection.id})">
                        🗑 Delete
                    </button>

                </div>
            `;


            container.appendChild(card);

        }
    );
}


// =====================================================
// CREATE COLLECTION
// =====================================================

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
                )?.value.trim();


            const description =
                document.getElementById(
                    "collectionDescription"
                )?.value.trim();


            const message =
                document.getElementById(
                    "collectionMessage"
                );


            try {

                const response =
                    await authenticatedFetch(
                        "/api/collections",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                description:
                                    description

                            })

                        }
                    );


                if (!response) {
                    return;
                }


                const data =
                    await response.json()
                        .catch(() => ({}));


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.error ||
                        "Unable to create collection."
                    );
                }


                if (message) {

                    message.textContent =
                        "Collection created successfully.";
                }


                collectionForm.reset();


                await loadCollections();


            } catch (error) {

                console.error(
                    "Creating collection failed:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message;
                }
            }

        }
    );
}


// =====================================================
// SEARCH COLLECTIONS
// =====================================================

async function searchCollections() {

    const searchInput =
        document.getElementById(
            "collectionSearch"
        );


    if (!searchInput) {
        return;
    }


    const keyword =
        searchInput.value.trim();


    if (keyword === "") {

        await loadCollections();

        return;
    }


    try {

        const response =
            await authenticatedFetch(
                "/api/collections/search?keyword=" +
                encodeURIComponent(keyword)
            );


        if (!response) {
            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to search collections."
            );
        }


        const collections =
            await response.json();


        displayCollections(
            collections
        );


    } catch (error) {

        console.error(
            "Collection search failed:",
            error
        );


        const container =
            document.getElementById(
                "collectionsContainer"
            );


        if (container) {

            container.innerHTML =
                `<p>${escapeHtml(
                    error.message
                )}</p>`;
        }
    }
}


// =====================================================
// EDIT COLLECTION
// =====================================================

async function editCollection(id) {

    const newName =
        prompt(
            "Enter new collection name:"
        );


    if (newName === null) {
        return;
    }


    const newDescription =
        prompt(
            "Enter new collection description:"
        );


    if (newDescription === null) {
        return;
    }


    try {

        const response =
            await authenticatedFetch(
                "/api/collections/" + id,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name:
                            newName.trim(),

                        description:
                            newDescription.trim()

                    })

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
                "Unable to update collection."
            );
        }


        await loadCollections();


    } catch (error) {

        console.error(
            "Editing collection failed:",
            error
        );


        alert(
            error.message ||
            "Unable to update collection."
        );
    }
}


// =====================================================
// DELETE COLLECTION
// =====================================================

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
                "/api/collections/" + id,
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
                "Unable to delete collection."
            );
        }


        await loadCollections();


    } catch (error) {

        console.error(
            "Deleting collection failed:",
            error
        );


        alert(
            error.message ||
            "Unable to delete collection."
        );
    }
}


// =====================================================
// COLLECTION PAGE INITIALIZATION
// =====================================================

if (
    window.location.pathname ===
    "/collections.html"
) {

    if (!getToken()) {

        window.location.href =
            "/login.html";

    } else {

        loadCollections();


        const searchButton =
            document.getElementById(
                "searchCollectionsBtn"
            );


        if (searchButton) {

            searchButton.addEventListener(
                "click",
                searchCollections
            );
        }


        const showAllButton =
            document.getElementById(
                "showAllCollectionsBtn"
            );


        if (showAllButton) {

            showAllButton.addEventListener(
                "click",
                loadCollections
            );
        }

    }
}


// =====================================================
// DOCUMENTS
// =====================================================


// =====================================================
// LOAD DOCUMENTS
// =====================================================

async function loadDocuments() {

    const container =
        document.getElementById(
            "documentsContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading documents...</p>";


    try {

        const response =
            await authenticatedFetch(
                "/api/documents"
            );


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
            `<p>${escapeHtml(
                error.message
            )}</p>`;
    }
}


// =====================================================
// DISPLAY DOCUMENTS
// =====================================================

function displayDocuments(documents) {

    const container =
        document.getElementById(
            "documentsContainer"
        );


    if (!container) {
        return;
    }


    if (
        !documents ||
        documents.length === 0
    ) {

        container.innerHTML =
            "<p>No documents found.</p>";

        return;
    }


    container.innerHTML = "";


    documents.forEach(
        function (document) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "note-card";


            let sizeText = "";


            if (
                document.fileSize !== null &&
                document.fileSize !== undefined
            ) {

                const size =
                    Number(
                        document.fileSize
                    );


                if (size < 1024) {

                    sizeText =
                        size + " B";

                } else if (size < 1024 * 1024) {

                    sizeText =
                        (size / 1024)
                            .toFixed(2)
                        + " KB";

                } else {

                    sizeText =
                        (size / (1024 * 1024))
                            .toFixed(2)
                        + " MB";
                }
            }


            card.innerHTML = `

                <h3>
                    📄 ${escapeHtml(
                        document.fileName
                    )}
                </h3>

                <p>
                    <strong>Type:</strong>
                    ${escapeHtml(
                        document.fileType
                    )}
                </p>

                <p>
                    <strong>Size:</strong>
                    ${escapeHtml(
                        sizeText
                    )}
                </p>

                ${
                    document.collectionId
                        ? `
                        <p>
                            <strong>Collection ID:</strong>
                            ${escapeHtml(
                                document.collectionId
                            )}
                        </p>
                        `
                        : `
                        <p>
                            <strong>Collection:</strong>
                            None
                        </p>
                        `
                }

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

        }
    );
}


// =====================================================
// LOAD COLLECTIONS FOR DOCUMENT UPLOAD
// =====================================================

async function loadCollectionsForDocuments() {

    const select =
        document.getElementById(
            "documentCollectionId"
        );


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


        select.innerHTML = `

            <option value="">
                No Collection
            </option>

        `;


        collections.forEach(
            function (collection) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    collection.id;


                option.textContent =
                    collection.name;


                select.appendChild(option);

            }
        );


    } catch (error) {

        console.error(
            "Loading document collections failed:",
            error
        );


        select.innerHTML = `

            <option value="">
                No Collection
            </option>

        `;
    }
}


// =====================================================
// UPLOAD DOCUMENT
// =====================================================

async function uploadDocument(event) {

    event.preventDefault();


    const fileInput =
        document.getElementById(
            "documentFile"
        );


    const collectionInput =
        document.getElementById(
            "documentCollectionId"
        );


    const message =
        document.getElementById(
            "documentMessage"
        );


    if (
        !fileInput ||
        !fileInput.files ||
        fileInput.files.length === 0
    ) {

        if (message) {

            message.textContent =
                "Please select a document.";
        }

        return;
    }


    const file =
        fileInput.files[0];


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    /*
     * Your DocumentController expects:
     *
     * @RequestParam("file")
     * @RequestParam(value = "collectionId",
     *               required = false)
     */


    if (
        collectionInput &&
        collectionInput.value.trim() !== ""
    ) {

        formData.append(
            "collectionId",
            collectionInput.value
        );
    }


    try {

        if (message) {

            message.textContent =
                "Uploading document...";
        }


        const token =
            getToken();


        const response =
            await fetch(
                "/api/documents/upload",
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    },

                    body: formData

                }
            );


        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "jwtToken"
            );


            window.location.href =
                "/login.html";


            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                "Document upload failed."
            );
        }


        const document =
            await response.json();


        console.log(
            "Uploaded document:",
            document
        );


        if (message) {

            message.textContent =
                "Document uploaded successfully.";
        }


        fileInput.value = "";


        if (collectionInput) {

            collectionInput.value =
                "";
        }


        await loadDocuments();


    } catch (error) {

        console.error(
            "Document upload failed:",
            error
        );


        if (message) {

            message.textContent =
                error.message ||
                "Document upload failed.";
        }
    }
}


// =====================================================
// SEARCH DOCUMENTS
// =====================================================

async function searchDocuments() {

    const searchInput =
        document.getElementById(
            "documentSearch"
        );


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


        if (container) {

            container.innerHTML =
                `<p>${escapeHtml(
                    error.message
                )}</p>`;
        }
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
                "/api/documents/" +
                id +
                "/download",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "jwtToken"
            );


            window.location.href =
                "/login.html";


            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to download document."
            );
        }


        const blob =
            await response.blob();


        const url =
            window.URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "document";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        window.URL.revokeObjectURL(
            url
        );


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
            "Deleting document failed:",
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

        loadCollectionsForDocuments();

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