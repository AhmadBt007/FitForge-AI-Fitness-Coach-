import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';

const FLAN_API_URL = `${BASE_URL}/generate`;
const { width } = Dimensions.get('window');

export default function ChatBotScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // 🧠 Step 1: Predefined responses
  const getPredefinedResponse = (prompt) => {
    if (!prompt) return null;

    const lower = prompt.toLowerCase().trim();

    // 👉 Greetings
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.includes(lower)) {
      return 'Hi there! How are you?';
    }

    // 👉 Weight-loss intent
    if (lower === 'i want to loose weight' || lower.includes('loose weight')) {
      return 'Sure, I can help with that! First, could you tell me your height?';
    }

    // 👉 Provide height
    if (lower.startsWith('my height is') || lower.startsWith('height is')) {
      return 'Got it. And what is your current weight?';
    }

    // 👉 Provide weight
    if (lower.startsWith('my weight is') || lower.startsWith('weight is')) {
      return 'Thanks! Finally, may I know your age?';
    }

    // 👉 Muscle-gain intent
    if (lower === 'i want to gain muscle' || lower.includes('gain muscle')) {
      return 'Awesome! Let’s begin. What is your current weight?';
    }

    // 👉 Age provided
    if (lower.startsWith('my age is') || lower.match(/^\\d+\\s*years?\\s*old$/)) {
      return 'Great! Based on your details I can suggest a personalized plan. Would you like a workout or diet recommendation first?';
    }

    // 👉 Gratitude
    if (lower === 'thank you' || lower === 'thanks') {
      return 'You’re welcome! Happy to help.';
    }

    // 👉 Farewell
    if (lower === 'bye' || lower === 'goodbye') {
      return 'Goodbye! Stay healthy and keep moving.';
    }

    // 👉 Identity
    if (lower === 'who are you') {
      return 'I’m FitForge, your AI fitness assistant.';
    }

    if (lower === 'why are you ok?') {
      return "I don't know what you mean by that.";
    }
    if (lower === 'why are you gay?') {
      return "I dont.";
    }

    //changing language 
    if(lower === 'kia tm mere se ess trha baat kr skte ho'){
      return 'ji han blkul mein ess trha bhi baat kr skta hoo '
    }
    if(lower === 'kia tm mere se es trha baat kr skte ho'){
      return 'ji han blkul mein ess trha bhi baat kr skta hoo '
    }
    if(lower === 'kia tm mere se ese baat kr skte ho'){
      return 'ji han blkul mein ess trha bhi baat kr skta hoo '
    }
    
    if(lower === 'kia tm mere se ess trha bat kr skte ho'){
      return 'ji han blkul mein ess trha bhi baat kr skta hoo '
    }
    if(lower === 'kia tm mere se es trha bat kr skte ho'){
      return 'ji han blkul mein ess trha bhi baat kr skta hoo '
    }
    if(lower === 'kia tm mere se ese bat kr skte ho'){
      return 'ji han blkul mein ess trha bhi baat kr skta hoo '
    }
    if(lower === 'kia tm mere se ese bat kr skte ho'){
      return 'ji han blkul mein ess trha bhi baat kr skta hoo '
    }
    
    // sher
    if (lower === 'mjhe koi sher sunao') {
      return `ye rha tmhara sher:-
              badalate mausamon kii sair mein dil ko laganaa ho
              kisii ko yaad rakhanaa ho kisii ko bhuul jaanaa ho
              hameshaa der kar detaa huu main
              
              kisii ko maut se pehle kisii Gam se bachaanaa ho
              haqiiqat aur thii kuchh us ko jaa ke ye bataanaa ho
              hameshaa der kar detaa huu main har kaam karne mein...`;
    }



    return null;
  };

  // 🧠 Step 2: Modified handleSend function
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { from: 'user', text: trimmed }]);
    setInput('');

    const predefined = getPredefinedResponse(trimmed);
    if (predefined) {
      setMessages(prev => [...prev, { from: 'bot', text: predefined }]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(FLAN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
      });
      const data = res.ok ? await res.json() : { response: `Error ${res.status}` };
      const botText = data?.response || 'No response.';
      setMessages(prev => [...prev, { from: 'bot', text: botText }]);
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: err.message || 'Network error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <Text style={styles.headerSubtitle}>How can I help you today?</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Start a conversation...</Text>
          </View>
        )}

        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.from === 'user'
                ? styles.userMessageContainer
                : styles.botMessageContainer,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.from === 'user'
                  ? styles.userBubble
                  : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.from === 'user'
                    ? styles.userText
                    : styles.botText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color="#666" />
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 16 }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Type your message..."
            placeholderTextColor="#666"
            value={input}
            onChangeText={setInput}
            style={styles.textInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              { opacity: input.trim() ? 1 : 0.5 },
            ]}
            disabled={!input.trim() || loading}
          >
            <MaterialIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 6,
  },
  botBubble: {
    backgroundColor: '#2a2a2a',
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
    fontWeight: '500',
  },
  botText: {
    color: '#e0e0e0',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  loadingBubble: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: width * 0.75,
  },
  loadingText: {
    color: '#e0e0e0',
    fontSize: 16,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    maxHeight: 120,
    paddingVertical: 12,
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
