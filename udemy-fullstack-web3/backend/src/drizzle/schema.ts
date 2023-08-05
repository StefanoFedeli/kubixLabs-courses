import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const users = pgTable('user_details', {
  user_id: uuid('user_id').primaryKey().defaultRandom(),
  first_name: varchar('first_name'),
  last_name: varchar('last_name'),
  role: varchar('role'),
  auth_type: varchar('auth_type'),
});

export const authBasic = pgTable('auth_basic', {
  user_id: uuid('user_id')
    .references(() => users.user_id)
    .primaryKey(),
  username: varchar('username').unique(),
  password: varchar('password'),
});

export const authMetamask = pgTable('auth_metamask', {
  user_id: uuid('user_id')
    .references(() => users.user_id)
    .primaryKey(),
  account_id: varchar('account_id').unique(),
});

export const badges = pgTable('badges', {
  badge_id: uuid('badge_id').primaryKey().defaultRandom(),
  title: varchar('title').unique(),
  photo: varchar('photo'),
  description: text('description'),
})

export const userBadges = pgTable('user_badges', {
  user_id: uuid('user_id')
    .references(() => users.user_id)
    .primaryKey(),
  badge_id: uuid('badge_id')
    .references(() => badges.badge_id)
    .primaryKey(),
});

export type UserDetailsModel = InferModel<typeof users>;
export type AuthBasicModel = InferModel<typeof authBasic>;
export type AuthMetamaskModel = InferModel<typeof authMetamask>;
export type BadgesModel = InferModel<typeof badges>;
export type UserBadgesModel = InferModel<typeof userBadges>;
