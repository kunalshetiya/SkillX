import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from "@nestjs/common";
import { PrismaClient } from "@skillx/database";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Optional: Handle shutdown hooks to ensure Prisma closes connections cleanly.
   */
  async enableShutdownHooks(app: INestApplication) {
    process.on("beforeExit", async () => {
      await app.close();
    });
  }
}
