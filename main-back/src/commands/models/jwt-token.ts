import { User } from "commands/models/user";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class JwtToken extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne((type) => User, (user) => user.jwtTokens)
  user: User;

  @Column({ type: "timestamp", nullable: true })
  logoutDate: Date | null;

  @Column({ type: "timestamp", nullable: true })
  banDate: Date | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP", nullable: true })
  updatedAt: Date;

  logout() {
    this.logoutDate = new Date();
  }

  active() {
    return this.logoutDate === null && this.banDate === null;
  }
}
