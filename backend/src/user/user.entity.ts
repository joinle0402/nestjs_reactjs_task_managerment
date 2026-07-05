import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column()
    fullname: string;
    @Column({ unique: true })
    username: string;
    @Column({ select: false })
    password: string;
}
