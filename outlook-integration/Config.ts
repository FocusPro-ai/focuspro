const config = {
  appId: "66279fbb-b96c-4c5b-8bc1-40015b0fe7a6",
  redirectUri:
    process.env.NODE_ENV === "development" || process.env.APP_STAGING === "true"
      ? "http://localhost:3000"
      : "https://www.focuspro.app",
  scopes: ["user.read", "mailboxsettings.read", "calendars.readwrite"],
};

export default config;
