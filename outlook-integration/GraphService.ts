import {
  Client,
  GraphRequestOptions,
  PageCollection,
  PageIterator,
} from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { endOfMonth, startOfMonth } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { User, Event } from "microsoft-graph";

let graphClient: Client | undefined = undefined;

function ensureClient(authProvider: AuthCodeMSALBrowserAuthenticationProvider) {
  if (!graphClient) {
    graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
  }

  return graphClient;
}

export async function getUser(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<User> {
  ensureClient(authProvider);
  const user: User = await graphClient
    ?.api("/me")
    .select("displayName,mail,mailboxSettings,userPrincipalName")
    .get();
  return user;
}

export async function getUserCalendar(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  timeZone: string
): Promise<Event[]> {
  ensureClient(authProvider);
  const now = new Date();
  const startDateTime = zonedTimeToUtc(
    startOfMonth(now),
    timeZone
  ).toISOString();
  const endDateTime = zonedTimeToUtc(endOfMonth(now), timeZone).toISOString();
  var response: PageCollection = await graphClient
    ?.api("/me/events")
    .header("Prefer", `outlook.timezone="${timeZone}"`)
    .query({ startDateTime, endDateTime })
    .select("subject,organizer,start,end,bodyPreview")
    .get();

  if (response["@odata.nextLink"]) {
    // Presence of the nextLink property indicates more results are available
    // Use a page iterator to get all results
    var events: Event[] = [];

    // Must include the time zone header in page
    // requests too
    var options: GraphRequestOptions = {
      headers: { Prefer: `outlook.timezone="${timeZone}"` },
    };

    var pageIterator = new PageIterator(
      graphClient!,
      response,
      (event) => {
        events.push(event);
        return true;
      },
      options
    );

    await pageIterator.iterate();

    return events;
  } else {
    return response.value;
  }
}

export async function createEvent(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  newEvent: Event
): Promise<Event> {
  ensureClient(authProvider);

  // Post /me/events
  // JSON representation of the new event is sent in the
  // request body
  return await graphClient?.api("/me/events").post(newEvent);
}
