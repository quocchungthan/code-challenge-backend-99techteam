import { Router, Request, Response  } from "express";
import { FeedbackService } from "../services/Feedback.services";
import { requireBasicAuth } from "../middlewares/requireBasicAuth";

export class FeedbackController {
  private static service = new FeedbackService();

  static async create(req: Request, res: Response) {
  }

  static async filter(req: Request, res: Response) {
  }

  static async getDetailById(req: Request, res: Response) {
    const detail = await this.service.getDetailById(req.params.id);
    if (detail) {
      res.json(detail);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  }

  static async updateById(req: Request, res: Response) {
    return this.service.updateById(req.params.id, req.body);
  }

  static async deleteById(req: Request, res: Response) {
    return this.service.deleteById(req.params.id);
  }
}

const router = Router();

router.get('/', FeedbackController.filter);
router.get('/:id', FeedbackController.getDetailById);
router.post('/', FeedbackController.create);
router.delete('/:id', requireBasicAuth, FeedbackController.deleteById);
router.put('/:id', requireBasicAuth, FeedbackController.updateById);

export default router;
