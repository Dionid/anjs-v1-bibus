import { UserRole } from "commands/models/user";
import { BaseEntity, Column, Entity } from "typeorm";

@Entity("user")
export class GetUserReadModel extends BaseEntity {
  @Column()
  id: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column()
  email: string;

  @Column({ type: "string" })
  "registration-date": string;
}
