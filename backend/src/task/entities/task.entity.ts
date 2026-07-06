import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TaskStatus } from '@/task/enums/task-status.enum';
import { TaskPriority } from '@/task/enums/task-priority.enum';
import { UserEntity } from '@/user/user.entity';

@Entity('tasks')
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column({ type: 'text', nullable: true })
    description?: string;
    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;
    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority: TaskPriority;
    @Column({ name: 'due_date', type: 'date', nullable: true })
    dueDate?: Date;
    @ManyToOne(() => UserEntity, { nullable: false, eager: false })
    @JoinColumn({ name: 'created_by' })
    createdBy: UserEntity;
    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;
}
