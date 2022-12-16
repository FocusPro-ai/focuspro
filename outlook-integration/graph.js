import { graphConfig } from "./authConfig";

export async function callCalendarEvents(accessToken) {
  const headers = new Headers();
  const Bearer = `Bearer ${accessToken}`;
  headers.append("Authorization", Bearer);

  const options = {
    method: "GET",
    headers: headers,
  };
  return fetch(graphConfig.calendarReadEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
