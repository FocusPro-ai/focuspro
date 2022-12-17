import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "66279fbb-b96c-4c5b-8bc1-40015b0fe7a6",
    authority:
      "https://login.microsoftonline.com/3dec2c66-305c-48fc-bace-e9d62b3bef8e",
    redirectUri:
      process.env.NODE_ENV === "development" ||
      process.env.APP_STAGING === "true"
        ? "http://localhost:3000"
        : "https://www.focuspro.app",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  consent: true,
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: [
    "User.Read",
    "openid",
    "profile",
    "Calendars.ReadWrite",
    "Calendars.Read",
    "Mail.Read",
    "Mail.ReadBasic",
  ],
};

export const CalendarReadToken = {
  scopes: ["Calendars.ReadWrite", "Calendars.Read"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  calendarReadEndpoint: `https://graph.microsoft.com/v1.0/me/events`,
};
