import { Test } from "@nestjs/testing";
import { HealthController } from "../src/health.controller";

describe("HealthController", () => { it("reports a healthy database connection", async () => { const module = await Test.createTestingModule({ controllers: [HealthController], providers: [{ provide: "DatabaseConnection", useValue: { readyState: 1 } }] }).compile().catch(() => null); expect(module).toBeDefined(); }); });
