import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 } from 'uuid';
import type { IHydratedStatus, IStatus } from '../../../../../libs/shared/src/interfaces';

@Entity({ tableName: 'status' })
export class Status extends AggregateRoot implements IHydratedStatus {
  @PrimaryKey()
  id: string = v4();

  @Property({ type: 'uuid' })
  projectId!: string;

  @Property({ length: 30, check: 'length(name) >= 3' })
  name!: string;

  @Property({ nullable: true, check: 'color ~ "^#(?:[0-9a-fA-F]{3}){1,2}$"' })
  color?: string;

  @Property()
  isFirst = false;

  @Property()
  isLast = false;

  @ManyToMany({ entity: () => Status, pivotTable: 'status_transition' })
  transitions = new Collection<Status>(this) as unknown as IStatus[];

  constructor(instance?: Partial<Status>) {
    super();
    Object.assign(this, instance);
  }

  // killEnemy(enemyId: string) {
  //   // logic
  //   this.apply(new HeroKilledDragonEvent(this.id, enemyId));
  // }
}