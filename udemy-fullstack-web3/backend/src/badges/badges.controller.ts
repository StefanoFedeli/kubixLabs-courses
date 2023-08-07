import { Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { AuthGuard } from '../users/auth.guard';
import { REQUEST } from '@nestjs/core';

interface Request {
  user: any;
}

@Controller('badges')
export class BadgesController {
  constructor(
    private readonly badgesService: BadgesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
  }

  @UseGuards(AuthGuard)
  @Get()
  getBadges() {
    const userId = this.request.user.userId;
    if (this.request.user.authType === 'metamask') {
      const accountId = this.request.user.accountId;
      console.log('ACCOUNT ID FROM JWT', accountId);
      return this.badgesService.getNFTBadges(accountId);
    }
    return this.badgesService.getBadges(userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  claimBadges() {
    const userId = this.request.user.userId;
    return this.badgesService.claimAllBadges(userId);
  }

  @UseGuards(AuthGuard)
  @Post("all")
  claimBadgeAll() {
    const userId = this.request.user.userId;
    if (this.request.user.authType === 'metamask') {
      const accountId = this.request.user.accountId;
      console.log('ACCOUNT ID FROM JWT', accountId);
      return this.badgesService.claimNFT(accountId);
    }
    return this.badgesService.claimAllBadges(userId);
  }

  @UseGuards(AuthGuard)
  @Post(':badgeId')
  claimBadge(@Param('badgeId') badgeId: string) {
    const userId = this.request.user.userId;
    return this.badgesService.claimBadge(userId, badgeId);
  }
}
