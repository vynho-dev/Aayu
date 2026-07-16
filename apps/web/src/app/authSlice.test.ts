import { describe, expect, it } from "vitest";

import reducer, { enableDevelopmentIdentity, setSessionToken } from "./authSlice";

describe("auth state", () => {
  it("distinguishes a ready development identity from an unresolved session", () => {
    expect(reducer(undefined, enableDevelopmentIdentity())).toEqual({ ready: true, token: null });
    expect(reducer(undefined, setSessionToken("token"))).toEqual({ ready: true, token: "token" });
  });
});
