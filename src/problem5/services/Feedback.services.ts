import { Feedback } from "@entities/Feedback";
import { AppDataSource } from "../configs/AppDataSource";

export class FeedbackService {
    private repo = AppDataSource.getRepository(Feedback);

    create(data: Partial<Feedback>) {

    }

    filter() {

    }

    async getDetailById(id: string): Promise<Feedback | null> {
        return this.repo.findOne({where: { id} });
    }

    updateById(id: string, data: Partial<Feedback>) {

    }

    async deleteById(id: string): Promise<void> {

    }
}
