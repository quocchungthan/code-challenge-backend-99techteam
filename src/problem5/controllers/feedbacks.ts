import { Router, Request, Response } from "express";
import { FeedbackService } from "../services/Feedback.services";
import { requireBasicAuth } from "../middlewares/requireBasicAuth";

/**
 * Feedback Controller
 * Handles CRUD operations for feedbacks.
 */
export class FeedbackController {
  private static service = new FeedbackService();

  static async create(req: Request, res: Response) {
    const feedback = req.body;
    const createdFeedback = await this.service.create(feedback);
    res.json(createdFeedback);
  }

  static async filter(req: Request, res: Response) {
    const feedbacks = await this.service.filter();
    res.json(feedbacks);
  }

  static async getDetailById(req: Request, res: Response) {
    const detail = await this.service.getDetailById(req.params.id);
    if (detail) {
      res.json(detail);
    } else {
      res.status(404).json({ message: "Not found" });
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

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Retrieve all feedbacks
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: List of all feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 */
router.get("/", FeedbackController.filter);

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Get feedback detail by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the feedback to retrieve
 *     responses:
 *       200:
 *         description: Feedback detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 */
router.get("/:id", FeedbackController.getDetailById);

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       200:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Invalid input
 */
router.post("/", FeedbackController.create);

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     summary: Delete feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the feedback to delete
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       401:
 *         description: Unauthorized — missing or invalid Basic Auth credentials
 *       404:
 *         description: Feedback not found
 */
router.delete("/:id", requireBasicAuth, FeedbackController.deleteById);

/**
 * @swagger
 * /api/feedback/{id}:
 *   put:
 *     summary: Update feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the feedback to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       401:
 *         description: Unauthorized — missing or invalid Basic Auth credentials
 *       404:
 *         description: Feedback not found
 */
router.put("/:id", requireBasicAuth, FeedbackController.updateById);

export default router;
