import { Inject, Injectable } from '@nestjs/common';
import { badges, userBadges } from '../drizzle/schema';
import { PG_CONNECTION } from '../drizzle/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class BadgesService {

  constructor(
    @Inject(PG_CONNECTION) private conn: NodePgDatabase,
    private readonly web3Service: Web3Service,
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

  async getNFTBadges(accountId: string) {
    const badge_res = (await this.conn.select().from(badges).execute())[0];
    const data = await this.web3Service.readSmartContract('balanceOf', [accountId]);
    if (!data || data == 0) {
      return [];
    }
    console.log('NFT BADGES', data, badge_res);
    return this.generateList(badge_res, data);
  }

  async claimBadge(userId: string, badgeId: string) {
    await this.conn.insert(userBadges).values({
      user_id: userId,
      badge_id: badgeId,
    });
  }

  async claimNFT(accountId: string) {
    const data = await this.web3Service.readSmartContract('balanceOf', [accountId]);
    if (!data || data == 0) {
      return {
        from: accountId, // The user's active address.
        to: this.web3Service.getContractAddress(), // Required except during contract publications.
        value: '0x0',
        data: await this.web3Service.getDataField(accountId,'https://ipfs.io/ipfs/bafyreiea2q4gsxfd7cbfsqdqj7rwe5n6vvja2kuk7nt3b3jupywpnov2sq/metadata.json'),
      };
    }
    throw new Error('You already claimed your NFT');
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


  private generateList(obj: any, response: number): any[] {
    const resultList: any[] = [];
    for (let i = 0; i < response; i++) {
      resultList.push(obj);
    }
    return resultList;
  }
}
