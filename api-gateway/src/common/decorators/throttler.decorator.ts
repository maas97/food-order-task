import { SetMetadata } from '@nestjs/common';

export const THROTTLER_LIMIT = 'throttler-limit';
export const THROTTLER_TTL = 'throttler-ttl';

/**
 * Decorator to set custom rate limiting for specific routes
 * @param limit Maximum number of requests within the TTL window
 * @param ttl Time-to-live in seconds
 */
export const Throttle = (limit: number, ttl: number) => 
  SetMetadata('throttler', { limit, ttl });
