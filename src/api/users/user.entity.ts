import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  Relation,
} from "typeorm";
import { AppDataSource } from "../../database/connect";
import { Passkeys } from "../passkeys/passkeys.entity";

@Entity("users")
export class User {
  @PrimaryColumn({ type: "uuid" })
  @Generated("uuid")
  id: string;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Passkeys, (passkeys) => passkeys.user)
  passkeys: Passkeys[];
}
