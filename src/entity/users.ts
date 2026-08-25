import { Entity, PrimaryGeneratedColumn, Column, JoinColumn } from "typeorm"
import { ManyToOne } from "typeorm/browser";
import { Situation } from "./situations.js";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nome!: string;

    @Column({unique: true})
    email!: string;

    @ManyToOne(()=> Situation, (situation)=> situation.users)
    @JoinColumn({name: "situation"})
    situation!: Situation

    @Column({type: "timestamp", default:()=>"CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default:()=>"CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;
}