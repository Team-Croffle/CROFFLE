import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('extension_storage')
export class ExtensionStorage {
  @PrimaryColumn()
  extensionId: string;

  @PrimaryColumn()
  key: string;

  @Column('text')
  value: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
