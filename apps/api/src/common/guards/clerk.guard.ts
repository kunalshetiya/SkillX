import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkGuard implements CanActivate {
  private readonly logger = new Logger(ClerkGuard.name);
  private clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('Missing or invalid authorization header');
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // 1. Verify the session token
      const sessionClaims = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      
      // 2. Fetch full user details from Clerk to get the primary email for JIT sync
      // This ensures we have a valid email for our Prisma record
      const clerkUser = await this.clerkClient.users.getUser(sessionClaims.sub);
      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

      request.user = {
        id: sessionClaims.sub,
        email: primaryEmail,
      };

      return true;
    } catch (error: any) {
      this.logger.error(`Clerk auth failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired session token');
    }
  }
}
