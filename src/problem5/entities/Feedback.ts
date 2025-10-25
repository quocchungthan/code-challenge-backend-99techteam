import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       description: Represents a feedback message submitted by a user.
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the feedback.
 *         senderName:
 *           type: string
 *           description: Name of the person who sent the feedback.
 *           example: "Jane Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the sender.
 *           example: "jane.doe@example.com"
 *         status:
 *           type: string
 *           enum: [pending, replied, omitted]
 *           description: Status of the feedback.
 *           example: "pending"
 *         subject:
 *           type: string
 *           description: Subject line of the feedback.
 *           example: "Website feedback"
 *         content:
 *           type: string
 *           nullable: true
 *           description: Detailed content of the feedback.
 *           example: "I love the new layout of your website!"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp indicating when the feedback was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp indicating the last time the feedback was updated.
 */
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
