import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CreateDietPlan() {
    const [meals, setMeals] = useState({
        breakfast: '',
        lunch: '',
        dinner: '',
        snack: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field: string, value: string) => {
        setMeals((prev) => ({ ...prev, [field]: value }));
        setSubmitted(false);
    };

    const handleSubmit = async () => {
        
        const hasContent = Object.values(meals).some(meal => meal.trim().length > 0);
        
        if (!hasContent) {
            Alert.alert('Error', 'Please enter at least one meal to create your diet plan.');
            return;
        }
        
        setSubmitted(true);
        try {
            const uid = await AsyncStorage.getItem('uid');
            if (!uid) return;
            const planName = `Diet Plan - ${new Date().toLocaleDateString()}`;
            await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/UserCustomDietPlan/${uid}.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planName,
                    meals,
                    createdAt: new Date().toLocaleDateString(),
                }),
            });
        } catch (e) {
            console.warn('Failed saving diet plan', e);
        }
    };

    const clearDietPlan = () => {
        setMeals({
            breakfast: '',
            lunch: '',
            dinner: '',
            snack: '',
        });
        setSubmitted(false);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
            <Text style={styles.title}>Create Diet Plan</Text>
            <Text style={styles.subtitle}>
                Enter your meals for each time of day to create your personalized diet plan
            </Text>
            
            <View style={styles.formGroup}>
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
                    <View key={mealType} style={{ marginBottom: 16 }}>
                        <Text style={styles.label}>{mealType[0].toUpperCase() + mealType.slice(1)}</Text>
                        <TextInput
                            style={[styles.input, styles.multiline]}
                            value={meals[mealType as keyof typeof meals]}
                            onChangeText={(value) => handleChange(mealType, value)}
                            placeholder={`Enter your ${mealType}...\nExample:\n• Oatmeal with berries\n• Greek yogurt\n• Banana`}
                            placeholderTextColor="#888"
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                ))}
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Create Diet Plan</Text>
                    </TouchableOpacity>
                    
                    {submitted && (
                        <TouchableOpacity style={styles.clearButton} onPress={clearDietPlan}>
                            <Text style={styles.clearButtonText}>Clear Plan</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {submitted && (
                <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>Your Diet Plan has been saved successfully</Text>
                    
                    {Object.entries(meals).map(([mealType, mealContent]) => {
                        if (!mealContent.trim()) return null;
                        
                        return (
                            <View key={mealType} style={styles.mealSection}>
                                <Text style={styles.mealTitle}>
                                    {mealType[0].toUpperCase() + mealType.slice(1)}
                                </Text>
                                <View style={styles.mealContent}>
                                    {mealContent.split('\n').map((line, index) => {
                                        const trimmedLine = line.trim();
                                        if (!trimmedLine) return null;
                                        
                                        return (
                                            <Text key={index} style={styles.mealItem}>
                                                • {trimmedLine}
                                            </Text>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}
                    
                    <View style={styles.tipSection}>
                        <Text style={styles.tipTitle}>💡 Tips for a Healthy Diet:</Text>
                        <Text style={styles.tipText}>• Include a variety of fruits and vegetables</Text>
                        <Text style={styles.tipText}>• Choose whole grains over refined grains</Text>
                        <Text style={styles.tipText}>• Include lean proteins in each meal</Text>
                        <Text style={styles.tipText}>• Stay hydrated throughout the day</Text>
                        <Text style={styles.tipText}>• Limit processed foods and added sugars</Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181818',
        paddingHorizontal: 16,
    },
    title: {
        color: '#27ae60',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 32,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: '#bbb',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    formGroup: {
        backgroundColor: '#232323',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    label: {
        color: '#bbb',
        fontSize: 16,
        marginBottom: 8,
        marginTop: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 8,
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        backgroundColor: '#27ae60',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    clearButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        flex: 1,
        marginLeft: 8,
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultCard: {
        backgroundColor: '#232323',
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    resultTitle: {
        color: '#27ae60',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    mealSection: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    mealTitle: {
        color: '#27ae60',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    mealContent: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 12,
    },
    mealItem: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 4,
        lineHeight: 22,
    },
    tipSection: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    tipTitle: {
        color: '#f39c12',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    tipText: {
        color: '#bbb',
        fontSize: 14,
        marginBottom: 6,
        lineHeight: 20,
    },
});
