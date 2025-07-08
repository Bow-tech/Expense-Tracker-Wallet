import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

//const API_URL = 'http://192.168.8.108:3000/api';
//const API_URL = "https://wallet-api-olct.onrender.com/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  //function that fetches transactions data from the api

  //useCallback is used to memoize the fetchTransactions function,  is used to prevent unnecessary re-creations of the function on every render, which can be beneficial for performance, especially if this hook is used in a component that re-renders frequently.
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  //another function that will get summary

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  //function that calls both fetchTransactions and fetchSummary at the same time
  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      //promise.all is used to run both fetchTransactions and fetchSummary at the same time, which can improve performance by  reducing the total time taken to fetch both sets of data.
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  //function to get delete method to delete a transaction
  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      // After deletion, reload the data to reflect changes
      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return {
    transactions,
    summary,
    isLoading,
    loadData,
    deleteTransaction,
  };
};
