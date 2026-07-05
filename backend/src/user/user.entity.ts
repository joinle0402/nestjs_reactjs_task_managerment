import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fullname: string;
    @Column({ unique: true })
    username: string;
    @Column({ select: false })
    password: string;
    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;
}
