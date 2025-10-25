import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('feedback')
export class Feedback {
    @PrimaryGeneratedColumn('uuid')
    id: string = '';

    @Column({ type: 'varchar', length: 100, nullable: false })
    senderName: string = '';

    @Column({ type:'varchar', length: 100, nullable: false })
    email: string = '';

    @Column({ type: 'varchar', length: 50, default: 'pending' })
    status: 'pending' | 'replied' | 'omitted' = 'pending';

    @Column({ type: 'text', nullable: false })
    subject: string = '';

    @Column({ type: 'text', nullable: true })
    content: string | null = null;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date = new Date();

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date = new Date();
}