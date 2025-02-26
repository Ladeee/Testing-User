import request from "supertest";
import app from "../server/server";
import axios from "axios";

vi.spyOn(axios, "get");

describe("Test API endpoints", () => {
  it("should return users list successfully", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return a user detail when required", async () => {
    const res = await request(app).get("/users/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
  });
});
