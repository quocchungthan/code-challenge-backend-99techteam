import { Feedback } from "@entities/Feedback";
import { AppDataSource } from "../configs/AppDataSource";

export class FeedbackService {
    private repo = AppDataSource.getRepository(Feedback);

    create(data: Partial<Feedback>) {

    }

    filter() {

    }

    getDetailById() {

    }

    updateById(id: string, data: Partial<Feedback>) {

    }

    deleteById() {

    }
}
