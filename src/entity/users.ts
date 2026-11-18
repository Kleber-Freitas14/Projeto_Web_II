import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import type { Relation } from "typeorm";
import { Situation } from "./situations.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: "enum",
    enum: ["ADMIN", "USER"],
    default: "USER",
  })
  tipoUsuario!: "ADMIN" | "USER";

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: true,
  })
  recoverPassword!: string | null;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  recoverPasswordExpiresAt!: Date | null;

  @ManyToOne(() => Situation, (situation) => situation.users)
  @JoinColumn({ name: "situationId" })
  situation!: Relation<Situation>;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
