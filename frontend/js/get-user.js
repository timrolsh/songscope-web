// to use with put a script tag with the attribute type=module

/*
Returns the JWT data object from the JWT stored in the cookie
*/
export function getUserInfo() {
    return fetch("/api/google-user-info", {
        credentials: "same-origin"
    });
}
