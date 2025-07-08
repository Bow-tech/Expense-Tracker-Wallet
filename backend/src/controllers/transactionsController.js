import { sql } from "../config/db.js";

//controller function to get all transactions by user_id from the database
export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    // Fetching transactions for the given user_id
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user" });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting the transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//controller function to create a transaction int the database

export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //inserting values into the transactions table
    const transaction = await sql`
      INSERT INTO transactions(user_id,title,amount,category)
      VALUES (${user_id},${title},${amount},${category})
      RETURNING *
      `;
    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//controller function to delete a transaction by id from the database
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    //validating the id to ensure it's a number
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    // Deleting the transaction with the given id
    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting the transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async (req, res) => {
  try {
    const { id } = req.params;

    //validating the id to ensure it's a number
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    // Deleting the transaction with the given id
    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting the transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//controller function to get transactions summary by user_id from the database
export async function getTransactionSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    // Fetching transactions summary for the given user_id

    const balanceResults = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResults = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;
    const expensesResults = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResults[0].balance,
      income: incomeResults[0].income,
      expenses: expensesResults[0].expense,
    });
  } catch (error) {
    console.error("Error getting the transaction summary:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
