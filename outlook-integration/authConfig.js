export const msalConfig = {
  auth: {
    clientId: "66279fbb-b96c-4c5b-8bc1-40015b0fe7a6",
    authority:
      "https://login.microsoftonline.com/3dec2c66-305c-48fc-bace-e9d62b3bef8e",
    redirectUri: "https://www.focuspro.app",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read", "Calendars.ReadWrite", "Calendars.Read"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  calendarReadEndpoint: `https://graph.microsoft.com/v1.0/me/events`,
};
