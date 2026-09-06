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