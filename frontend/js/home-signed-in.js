import {getUserInfo} from "/js/get-user.js";
getUserInfo().then((fetchResponse) => {
    fetchResponse.json().then((response) => {
        document.getElementById("welcome").innerHTML += ` ${response.username}!`;
    });
});
