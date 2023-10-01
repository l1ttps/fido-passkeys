import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { AppDataSource } from "../../database/connect";
import { User } from "../users/user.entity";

@Entity("passkeys")
export class Passkeys {
  @PrimaryColumn({ type: "uuid" })
  @Generated("uuid")
  id: string;
  @ManyToOne(() => User, (user) => user.passkeys)
  user: string;
  @Column()
  publicKey: string;
  @Column()
  credentialID: string;
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
