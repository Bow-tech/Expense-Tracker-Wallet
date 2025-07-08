import express from "express";

import {
  createTransaction,
  deleteTransaction,
  getTransactionsByUserId,
  getTransactionSummaryByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

//get request to fetch  transaction by user_id
router.get("/:userId", getTransactionsByUserId);

// creating a transaction in the database
router.post("/", createTransaction);

//route to delete a transaction by transaction id
router.delete("/:id", deleteTransaction);

//get request to fetch transactions summary by user_id

router.get("/summary/:userId", getTransactionSummaryByUserId);

export default router;
