import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteTask } from "./tasksApi";

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("deleteTask", () => {
    it("sends a DELETE request and accept a 204 response without parsing JSON", async () => {
        const json = vi.fn();

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            status: 204,
            json
        });

        vi.stubGlobal("fetch", fetchMock);
        await expect(deleteTask("42")).resolves.toBeUndefined();

        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/tasks/42", { method: "DELETE" });
        expect(json).not.toHaveBeenCalled();
    });
});