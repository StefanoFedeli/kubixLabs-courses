import { Inject, Injectable } from '@nestjs/common';
import { badges, userBadges } from '../drizzle/schema';
import { PG_CONNECTION } from '../drizzle/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';

@Injectable()
export class BadgesService {

  constructor(
    @Inject(PG_CONNECTION) private conn: NodePgDatabase,
    private jwtService: JwtService,
  ) {
  }

  async getBadges(userId: string) {
    const data = await this.conn.select().from(userBadges)
      .innerJoin(badges, eq(userBadges.badge_id, badges.badge_id))
      .where(eq(userBadges.user_id, userId)).execute();
    if (!data) {
      return [];
    }
    return data.map((d) => d.badges);
  }

  async claimBadge(userId: string, badgeId: string) {
    await this.conn.insert(userBadges).values({
      user_id: userId,
      badge_id: badgeId,
    });
  }

  async claimAllBadges(userId: string) {
    const data = await this.conn.select().from(badges).execute();
    if (!data) {
      return;
    }
    for (const d of data) {
      await this.claimBadge(userId, d.badge_id);
    }
  }

}
