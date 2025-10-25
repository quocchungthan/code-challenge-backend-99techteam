import { MigrationInterface, QueryRunner } from "typeorm";

export class FeedbackTable1761369682185 implements MigrationInterface {
    name = 'FeedbackTable1761369682185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderName" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'pending', "subject" text NOT NULL, "content" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "feedback"`);
    }

}
