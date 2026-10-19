import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { JwtAuthGuard, PermissionsGuard } from "@/auth/auth.guard";
import type { JwtUser } from "@/auth/auth.service";
import { RequirePermissions } from "@/common/permissions.decorator";
import { ResourceService } from "./resource.service";

type AdminRequest = Request & { id?: string; user: JwtUser };
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("admin")
export class AdminResourcesController { constructor(private readonly resources: ResourceService) {}
  private meta(request: AdminRequest) { return { ip: request.ip, userAgent: request.get("user-agent"), requestId: request.id }; }
  @RequirePermissions("dashboard.view") @Get("dashboard") dashboard() { return this.resources.dashboard(); }
  @Get(":resource/export") @Header("content-type", "text/csv; charset=utf-8") async export(@Param("resource") resource: string, @Query() query: Record<string, string>, @Res() response: Response) { response.setHeader("content-disposition", `attachment; filename=${resource}-${new Date().toISOString().slice(0, 10)}.csv`); response.send(await this.resources.exportCsv(resource, query)); }
  @Get(":resource") list(@Param("resource") resource: string, @Query() query: Record<string, string>) { return this.resources.list(resource, query); }
  @Get(":resource/:id") one(@Param("resource") resource: string, @Param("id") id: string) { return this.resources.one(resource, id); }
  @Post(":resource") create(@Param("resource") resource: string, @Body() body: Record<string, unknown>, @Req() request: AdminRequest) { return this.resources.create(resource, body, request.user, this.meta(request)); }
  @Patch(":resource/:id") update(@Param("resource") resource: string, @Param("id") id: string, @Body() body: Record<string, unknown>, @Req() request: AdminRequest) { return this.resources.update(resource, id, body, request.user, this.meta(request)); }
  @Delete(":resource/:id") remove(@Param("resource") resource: string, @Param("id") id: string, @Req() request: AdminRequest) { return this.resources.remove(resource, id, request.user, this.meta(request)); }
}
