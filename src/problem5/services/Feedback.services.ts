import { Feedback } from "../entities/Feedback";
import { AppDataSource } from "../configs/AppDataSource";
import { v4 as uuidv4 } from 'uuid';
import { EntityNotFoundError } from "typeorm";

export class FeedbackService {
    private repo = AppDataSource.getRepository(Feedback);

    create(data: Feedback) {
        const newEntry = new Feedback();

        newEntry.id = uuidv4();
        newEntry.senderName = data.senderName;
        newEntry.email = data.email;
        newEntry.subject = data.subject;
        newEntry.content = data.content;
        
        this.repo.create(newEntry);

        return this.repo.save(newEntry);
    }

    filter(q: string, status: 'pending' | 'replied' | 'omitted' | null) {
        const query = this.repo.createQueryBuilder('feedback');
        if (q) {
            query.where('feedback.subject LIKE :q', { q: `%${q}%` });
        }
        if (status) {
            query.andWhere('feedback.status = :status', { status });
        }
        return query.getMany();

    }

    async getDetailById(id: string): Promise<Feedback | null> {
        return this.repo.findOne({where: { id} });
    }

    async updateById(id: string, data: Partial<Feedback>) {
        const entity = await this.getDetailById(id);
        if (!entity) {
            throw new EntityNotFoundError(Feedback, 'Entity not found');
        }
        entity.senderName = data.senderName ?? entity.senderName;
        entity.email = data.email ?? entity.email;
        entity.status = data.status ?? entity.status;
        entity.subject = data.subject ?? entity.subject;
        entity.content = data.content ?? entity.content;

        return await this.repo.save(entity);
    }

    async deleteById(id: string): Promise<void> {
        const entity = await this.getDetailById(id);
        if (!entity) {
            throw new EntityNotFoundError(Feedback, 'Entity not found');
        }
        await this.repo.delete(id);
    }
}
