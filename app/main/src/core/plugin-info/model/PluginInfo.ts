import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PluginInfo {
  @PrimaryColumn('varchar')
  id: string;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column()
  author: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: true })
  main?: string;
}
