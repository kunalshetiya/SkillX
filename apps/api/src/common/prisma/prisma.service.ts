import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication, Logger } from "@nestjs/common";
import { PrismaClient } from "@skillx/database";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("Successfully connected to the database");
    } catch (error) {
      this.logger.error("Failed to connect to the database", error);
      throw error;
    }
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
