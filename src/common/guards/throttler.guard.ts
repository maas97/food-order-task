import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: any
  ): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const url = request.originalUrl;
    
    throw new ThrottlerException(
      `Rate limit exceeded. Too many requests from IP: ${ip} to endpoint: ${url}. Please try again later.`
    );
  }
}
