import { Body, Controller, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard, PermissionsGuard } from "@/auth/auth.guard";
import type { JwtUser } from "@/auth/auth.service";
import { RequirePermissions } from "@/common/permissions.decorator";
import { ActionsService } from "./actions.service";

type AdminRequest = Request & { user: JwtUser };
@UseGuards(JwtAuthGuard, PermissionsGuard) @Controller("admin/actions")
export class ActionsController { constructor(private readonly actions: ActionsService) {}
  @RequirePermissions("leads.update", "clients.create") @Post("leads/:id/convert") convert(@Param("id") id: string, @Req() request: AdminRequest) { return this.actions.convertLead(id, request.user); }
  @RequirePermissions("projects.update") @Patch("projects/:id/status") status(@Param("id") id: string, @Body("status") status: string, @Req() request: AdminRequest) { return this.actions.updateProjectStatus(id, status, request.user); }
  @RequirePermissions("payments.create", "invoices.update") @Post("invoices/:id/payments") payment(@Param("id") id: string, @Body() body: { amount: number; method: string; reference?: string; paidAt?: string; notes?: string }, @Req() request: AdminRequest) { return this.actions.recordPayment(id, body, request.user); }
}
