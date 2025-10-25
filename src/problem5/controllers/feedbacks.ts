import { Router, Request, Response } from "express";
import { FeedbackService } from "../services/Feedback.services";
import { requireBasicAuth } from "../middlewares/requireBasicAuth";
import { EntityNotFoundError } from "typeorm";

/**
 * Feedback Controller
 * Handles CRUD operations for feedbacks.
 */
export class FeedbackController {
  private static service = new FeedbackService();

  static async create(req: Request, res: Response) {
    try {
      const feedback = req.body;
      const createdFeedback = await FeedbackController.service.create(feedback);
      res.json(createdFeedback);
    } catch (error) {
      console.error("Create Feedback Error:", error);
      res.status(400).json({ message: "Invalid input" });
    }
  }

  static async filter(req: Request, res: Response) {
    try {
      const status = req.query.status?.toString() ?? null;
      const q = req.query.q?.toString() ?? "";

      const feedbacks = await FeedbackController.service.filter(
        q,
        status as "pending" | "replied" | "omitted" | null
      );
      res.json(feedbacks);
    } catch (error) {
      console.error("Filter Feedback Error:", error);
      res.status(400).json({ message: "Invalid query parameters" });
    }
  }

  static async getDetailById(req: Request, res: Response) {
    try {
      const detail = await FeedbackController.service.getDetailById(req.params.id);
      if (detail) {
        res.json(detail);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (error) {
      console.error("Get Feedback Error:", error);
      res.status(404).json({ message: "Not found" });
    }
  }

  static async updateById(req: Request, res: Response) {
    try {
      if (req.body.status && !["pending", "replied", "omitted"].includes(req.body.status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }
      const updated = await FeedbackController.service.updateById(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Update Feedback Error:", error);
      if (error instanceof EntityNotFoundError) {
        res.status(404).json({ message: "Feedback not found" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  static async deleteById(req: Request, res: Response) {
    try {
      const deleted = await FeedbackController.service.deleteById(req.params.id);
      res.json(deleted);
    } catch (error) {
      console.error("Delete Feedback Error:", error);
      if (error instanceof EntityNotFoundError) {
        res.status(404).json({ message: "Feedback not found" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}

const router = Router();

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Retrieve all feedbacks (with optional filters)
 *     tags: [Feedback]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: Search query to filter feedbacks by sender name, email, or subject.
 *         example: "John"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, replied, omitted]
 *         required: false
 *         description: Filter feedbacks by status.
 *         example: "pending"
 *     responses:
 *       200:
 *         description: List of feedbacks matching the filters (or all feedbacks if no filters provided)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Invalid query parameters
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
 *       500:
 *         description: Internal server error
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
 *       400:
 *         description: Invalid input or status value
 *       401:
 *         description: Unauthorized — missing or invalid Basic Auth credentials
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", requireBasicAuth, FeedbackController.updateById);

export default router;
