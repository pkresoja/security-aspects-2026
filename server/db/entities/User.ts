import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Friend } from "./Friend";

@Index("uq_user_discord_id", ["discordId"], { unique: true })
@Entity("user", { schema: "sde_sase_2026" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "discord_id", unique: true, length: 255 })
  discordId: string;

  @Column("varchar", { name: "user_name", nullable: true, length: 255 })
  userName: string | null;

  @Column("varchar", { name: "display_name", nullable: true, length: 255 })
  displayName: string | null;

  @Column("varchar", { name: "avatar_url", nullable: true, length: 255 })
  avatarUrl: string | null;

  @Column("datetime", {
    name: "registered_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  registeredAt: Date;

  @Column("datetime", { name: "last_login_at", nullable: true })
  lastLoginAt: Date | null;

  @OneToMany(() => Friend, (friend) => friend.user)
  friends: Friend[];
}
