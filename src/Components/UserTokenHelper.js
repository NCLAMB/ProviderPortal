import axios from 'axios';

import Moment from 'moment';
async function GetValidUserToken() {
    
    let currentToken = document.getElementById('usr-token').value;
    //if user was logged in when the portal was loaded
    if (currentToken.length > 0) {
        const expires = document.getElementById('token-expires').value;

        const now = Moment();
        const expiresAsDate = Moment(expires);
        const hasTokenExpired = expiresAsDate.isBefore(now);
  
        if (hasTokenExpired) {
            const res = await axios.get("/providerportalentry/RefreshAccessToken");
            const { TokenExpiresDateTime, UserToken, UserIsAuthenticated } = res.data;
            if (UserIsAuthenticated) {
      
                const hiddenUserToken = document.getElementById("usr-token");
                hiddenUserToken.value = UserToken;
                const hiddenUserTokenExpires = document.getElementById("token-expires");
                hiddenUserTokenExpires.value = TokenExpiresDateTime;

                currentToken = UserToken;
            }
        }
    }
    return currentToken;
}
function VerifyCookies() {
    //console.log("looking for asp cookie");
    const cname = "isAuthenticated";
    var isAuthenticatedCookieSetting =false;
    var isAuthenticatedCookieFound = false;
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            // return c.substring(name.length, c.length);
          
            isAuthenticatedCookieFound = true;
            if (c.substring(name.length, c.length) === "True") {
                isAuthenticatedCookieSetting = true;
            }

        }
    }
    let serverThinksUserIsLoggedIn = false;
    if (document.getElementById('is-authenticated').value === 'True') {
        serverThinksUserIsLoggedIn = true;
    }
    var authenticationCookiesInconsistentWithServer =
        serverThinksUserIsLoggedIn && (isAuthenticatedCookieFound === false || isAuthenticatedCookieSetting === false);
    return {
        authenticationCookiesInconsistentWithServer: authenticationCookiesInconsistentWithServer,
        isAuthenticatedCookieFound: isAuthenticatedCookieFound,
        isAuthenticatedCookieSetting: isAuthenticatedCookieSetting,
        serverThinksUserIsLoggedIn: serverThinksUserIsLoggedIn
    };
}

export { GetValidUserToken, VerifyCookies};

