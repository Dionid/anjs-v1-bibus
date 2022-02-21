import {User} from "models/user";
import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {v4} from "uuid";


@Entity()
export class JwtToken extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(type => User, user => user.jwtTokens, {
    eager: true
  })
  user: User

  @Column({ type: 'timestamp', nullable: true })
  logoutDate: Date | null

  @Column({ type: 'timestamp', nullable: true })
  banDate: Date | null

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date

  static createNew(user: User): JwtToken {
    const newJwtToken = new JwtToken()
    newJwtToken.id = v4()
    newJwtToken.createdAt = new Date()
    newJwtToken.logoutDate = null
    newJwtToken.banDate = null
    newJwtToken.user = user

    return newJwtToken
  }

  logout() {
    this.logoutDate = new Date()
  }
}
