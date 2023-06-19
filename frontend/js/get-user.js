// to use with put a script tag with the attribute type=module

/*
Returns the JWT data object from the JWT stored in the cookie
*/
export function getUserInfo() {
    const google_id = JSON.parse(atob(document.cookie.substring(6).split(".")[1])).sub;
    return fetch("/api/google-user-info", {
        credentials: "same-origin"
    });
}
