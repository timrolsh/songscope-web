import {getUserInfo} from "/js/get-user.js";
getUserInfo().then((fetchResponse) => {
    fetchResponse.json().then((response) => {
        document.getElementById("welcome").innerHTML += ` ${response.username}!`;
        const username_field = document.getElementById("username_field");
        const username_button = document.getElementById("username_button");
        username_button.addEventListener("click", () => {
            console.log("a");
            fetch("/api/change-username", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username: username_field.value})
            }).then(() => {
                alert("username updated");
                location.reload();
            });
        });
    });
});
