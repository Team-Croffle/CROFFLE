import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'text' })
  value: string;
}
