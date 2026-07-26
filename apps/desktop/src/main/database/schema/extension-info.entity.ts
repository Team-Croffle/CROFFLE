import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('extension_info')
export class ExtensionInfo {
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

  @Column({ type: 'simple-json', nullable: true })
  engines?: unknown;

  @Column({ type: 'simple-json', nullable: true })
  contributes?: unknown;
}
