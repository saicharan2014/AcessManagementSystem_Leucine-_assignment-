import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Request } from "./Request";

@Entity()
export class Software {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column("text")
  description: string;

  @Column("simple-array")
  accessLevels: string[];

  @OneToMany(() => Request, (request) => request.software)
  requests: Request[];
}
