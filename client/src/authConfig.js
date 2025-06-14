import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_MSA_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSA_TENANT}`,
        redirectUri: "https://wholesale-shipping-a37560cfc6bc.herokuapp.com/"
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                switch (level) {
                    case LogLevel.Error: console.error(message); break;
                    case LogLevel.Info: console.info(message); break;
                    case LogLevel.Verbose: console.debug(message); break;
                    case LogLevel.Warning: console.warn(message); break;
                }
            }
        }
    }
};

export const loginRequest = {
    scopes: ["User.Read"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
