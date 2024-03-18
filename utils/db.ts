///
import { User, Tokens } from "./types.ts";
import { refreshAccessTokens } from "./spotifyclient.ts";
// Open KV
const kv = await Deno.openKv();

export async function setUser(user: User, session: string, tokens: Tokens) {
  await kv
    .atomic()
    .set(["users", user.id], user)
    .set(["users_by_session", session], user)
    .set(["tokens_by_user", user.id], tokens)
    .commit();
}

export async function getUserBySession(session: string) {
  const user = await kv.get<User>(["users_by_session", session]);
  return user.value;
}

export async function getTokensByUser(user_id: string) {
  const tokens = await kv.get<Tokens>(["tokens_by_user", user_id]);
  const currTime = new Date().getTime() / 1000;
  if (
    tokens.value &&
    tokens.value.expiration &&
    tokens.value.expiration < currTime
  ) {
    const new_tokens = await refreshAccessTokens(tokens.value);
    await kv.atomic().set(["tokens_by_user", user_id], new_tokens).commit();
    return new_tokens;
  }
  return tokens.value;
}

export async function setTokensByUser(user_id: number, tokens: Tokens) {
  await kv.atomic().set(["tokens_by_user", user_id], tokens).commit();
}
