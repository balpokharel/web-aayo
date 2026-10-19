import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, type Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, { success: true; message: string; data: T }> { intercept(_: ExecutionContext, next: CallHandler<T>): Observable<{ success: true; message: string; data: T }> { return next.handle().pipe(map((result) => ({ success: true, message: "Request completed successfully", data: result }))); } }
