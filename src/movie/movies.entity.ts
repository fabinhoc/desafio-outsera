import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: string;

  @Column()
  title: string;

  @Column()
  studio: string;

  @Column()
  producer: string;

  @Column({ nullable: true })
  winner: string | null;
}
