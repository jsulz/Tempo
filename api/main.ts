import { Application, Router } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Context } from "https://deno.land/x/oak@14.2.0/context.ts";
import {
  Session,
  CookieStore,
} from "https://deno.land/x/oak_sessions@v4.1.11/mod.ts";
// deno-lint-ignore no-import-assertions
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";

const router = new Router();
export const app = new Application();
// cookie name for the store is configurable, default is: {sessionDataCookieName: 'session_data'}
export const store = new CookieStore("pageCount");
app.use(Session.initMiddleware(store));

//app.use(router.allowedMethods());
app.use(
  oakCors({
    origin: "http://localhost:80",
    credentials: true,
  })
);
app.use(router.allowedMethods());
app.use(router.routes());

const env = await load();
const CLIENT_ID = env["CLIENT_ID"];

router.get("/api/auth", async (context: Context) => {
  console.error(CLIENT_ID);
  console.error(context);
  // Examples of getting and setting variables on a session
  if (!(await context.state.session.has("pageCount"))) {
    await context.state.session.set("pageCount", 0);
  } else {
    await context.state.session.set(
      "pageCount",
      (await context.state.session.get("pageCount")) + 1
    );
  }
  context.response.body = await context.state.session.get("pageCount");
});
await app.listen({ port: 8000 });
