import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Request } from "./Request";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: ["Employee", "Manager", "Admin"],
    default: "Employee",
  })
  role: string;

  @OneToMany(() => Request, (request) => request.user)
  requests: Request[];
}
