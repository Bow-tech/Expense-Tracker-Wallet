import { View, Text, Alert, TouchableOpacity, ActivityIndicator, ActivityIndicatorBase } from 'react-native'
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { API_URL } from '../../constants/api';
import { styles } from '../../assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TextInput } from 'react-native';
import { useUser } from '@clerk/clerk-expo';


const CATEGORIES = [
    { id: "food", name: "Food &nDrinks", icon: "fast-food" },
    { id: "transportation", name: "Transport", icon: "car" },
    { id: "shopping", name: "Shopping", icon: "cart" },
    { id: "bills", name: "Bills", icon: "receipt" },
    { id: "entertainment", name: "Entertainment", icon: "film" },
    { id: "income", name: "Income", icon: "cash" },
    { id: "other", name: "Other", icon: "ellipsis-horizontal" }
];


const createScreen = () => {
    const router = useRouter();
    const { user } = useUser();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isExpense, setIsExpense] = useState(true); //if true, the transaction is an expense, if false, it is an income
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        //validations
        if (!title.trim()) return Alert.alert("Error", "Please enter a title for the transaction.");
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return
            Alert.alert("Error", "Please enter a valid amount for the transaction.");
            return;
        }

        if (!selectedCategory) return Alert.alert("Error", "Please select a category for the transaction.");

        setIsLoading(true);

        try {
            //format the amount (negative for expenses, positive for income)
            const formattedAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

            const response = await fetch(`${API_URL}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.id,
                    title,
                    amount: formattedAmount,
                    category: selectedCategory,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error creating transaction:", errorData);
                throw new Error(errorData.message || "Failed to create transaction");
            }
            Alert.alert("Success", "Transaction created successfully");
            router.back(); //take the user back to the previous screen after successful creation
         
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to create transaction.");
            console.error("Error creating transaction:", error);
        } finally {
            setIsLoading(false);
        
        }
    }

  return (
    <View style={styles.container}>
          {/*HEADER*/}
          <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color={ COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>NewTransaction</Text>
              <TouchableOpacity style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
                  onPress={handleCreate}
                  disabled={isLoading}
              >
                  <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
                  { !isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
              </TouchableOpacity>
          </View>

          <View style={styles.card}>
              <View style={styles.typeSelector}>
                  {/* Expense Selector */}
                  <TouchableOpacity
                      style={[styles.typeButton, isExpense && styles.typeButtonActive]}
                      onPress={() => setIsExpense(true)}
                  >
                      <Ionicons
                            name="arrow-down-circle"
                            size={22}
                          color={isExpense ? COLORS.white : COLORS.expense}
                          style={styles.typeIcon}
                      />
                      <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive] 
                      }>Expense</Text>
                  </TouchableOpacity>

                  {/* Income Selector */}
                    <TouchableOpacity
                        style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
                      onPress={() => setIsExpense(false)}
                    >
                        <Ionicons
                            name="arrow-up-circle"
                            size={22}
                            color={!isExpense ? COLORS.white : COLORS.income}
                            style={styles.typeIcon}
                        />
                        <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>
                            Income
                        </Text>
                    </TouchableOpacity> 
                  
              </View>

              {/* Amount Container */}
              <View style={styles.amountContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                      placeholderTextColor={COLORS.textLight}
                  />    
             </View> 


              {/*Input Container*/}
              <View style={styles.inputContainer}>
                  <Ionicons
                        name="create-outline"
                        size={22}
                        color={COLORS.textLight}
                      style={styles.inputIcon}
                  />
                    <TextInput
                        style={styles.input}
                        placeholder="Transaction Title"
                        value={title}
                        onChangeText={setTitle}
                      placeholderTextColor={COLORS.textLight}
                    />
              </View>

              {/*Category Title*/}
              <Text style={styles.sectionTitle}>
                  <Ionicons name='pricetag-outline' size={16} color={COLORS.text} /> Category
              </Text>
              
              {/*Map all the Category*/}
                <View style={styles.categoryGrid}>
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category.name && styles.categoryButtonActive,
                            ]}
                            onPress={() => setSelectedCategory(category.name)}
                        >
                            <Ionicons
                                name={category.icon}
                                size={20}
                                color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                                style={styles.categoryIcon}
                            />
                            <Text style={[
                                styles.categoryButtonText,
                                selectedCategory === category.name && styles.categoryButtonTextActive,
                            ]}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
              </View>
              
          </View> 
          
            {/*Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
          
    </View>
    
  )
    }


export default createScreen;