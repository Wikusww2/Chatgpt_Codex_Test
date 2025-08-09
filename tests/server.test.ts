import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/server";

describe("HTTP Server", () => {
  it("responds with greeting and sumExample", async () => {
    const res = await request(app).get("/api");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("sumExample", 5);
  });
});
