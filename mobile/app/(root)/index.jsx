import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, View, Image, Alert, TouchableOpacity, FlatList, RefreshControl} from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles.js";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard.jsx";
import { TransactionItem } from "../../components/TransactionItem.jsx";
import NoTransactionsFound from "../../components/NoTransactionFound.jsx";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user.id);
  
  //onRefresh is a function that is called when the user pulls down to refresh the list of transactions
  // it sets the refreshing state to true, calls the loadData function to fetch the latest transactions,
  // and then sets the refreshing state to false after the data is loaded
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // useEffect is used to load data when the component mounts or when the user id changes
  useEffect(() => {
    loadData();
  }, [loadData]);


  //onDelete is a function that is passed to the TransactionItem component
  // it is used to delete a transaction when the delete button is pressed
  const handleDelete = (id) => { 
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: ()=> 
            deleteTransaction(id)},
      ]) 
  }

  //loading state is used to show a loader while the data is being fetched
  // if isLoading is true, we return a PageLoader component to show a loading spinner
  // this is useful to avoid showing empty data or errors while the data is being fetched
  // once the data is loaded, we can render the transactions and summary
  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* header*/}
        <View style={styles.header}>
          {/* header left */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* header right */}

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalanceCard summary={summary} />
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      {/*FlatList isa performance-optimized component for rendering long lists in React Native,in a scrollable way*/} 

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}
