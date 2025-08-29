# FitForge-AI-Fitness-Coach-
FitApp - AI Fitness Companion  A cross-platform mobile app built with React Native and Expo, offering personalized workout plans powered by AI. Track workouts, create diet plans, and get fitness insights. Features include AI-powered recommendations, progress tracking, and an interactive chat for health advice.


## Features

- **AI-Powered Workouts**: Get personalized workout recommendations using Hugging Face's Flan model
- **Fitness Tracking**: Log and monitor your daily activities and progress
- **User Dashboard**: Visualize your fitness journey with intuitive charts and statistics
- **Cross-Platform**: Works on both iOS and Android devices
- **Modern UI/UX**: Clean and intuitive interface for seamless user experience

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- npm or Yarn
- Python 3.8+
- Git
- Expo CLI (install with `npm install -g expo-cli`)
- Xcode (for iOS development)
- Android Studio (for Android development)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd fit-app
```

### 2. Set Up Python Backend

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn transformers torch
   ```

3. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### 3. Set Up React Native Frontend

1. Install Node.js dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Install required global packages:
   ```bash
   npm install -g expo-cli
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Use the Expo Go app on your mobile device or an emulator to run the application.

## AI Integration

This application uses Hugging Face's Flan model for AI-powered features. The AI can:
- Generate personalized workout plans
- Provide exercise recommendations
- Answer fitness-related questions
- Analyze workout data for insights

## Running the App

1. **iOS**:
   - Install Xcode from the Mac App Store
   - Open the project in Xcode and run on a simulator or physical device

2. **Android**:
   - Install Android Studio
   - Set up an Android Virtual Device (AVD) or connect a physical device
   - Run the app using Android Studio or the Expo Go app

## Project Structure

```
fit-app/
├── app/                  # Main application code
├── assets/               # Images, fonts, and other static files
├── components/           # Reusable UI components
├── screens/              # Application screens
├── services/             # API and service integrations
├── utils/                # Utility functions
└── app.json              # Expo configuration
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing cross-platform development experience
- [Hugging Face](https://huggingface.co/) for their powerful AI models
- The React Native community for their continuous support
- User wants to store current weight and height in a separate backend table (UserProfile) when entered in Profile.jsx and saved.
- This requires both frontend (Profile.jsx/tsx) and backend changes (new table, API endpoint).
- Only the logged-in user can view/edit their own weight/height profile data.
- UserDashboard now loads and displays all profile info (name, weight, height, gender, age, BMI) for the current logged-in user from Firebase.
- UserDashboard should allow saving daily calorie needs (based on goal) to a new `totalCalories` attribute in UserProfile.

## Task List
- [x] Add weight and height input fields to Profile.jsx (if not present)
- [x] Create UserProfile table/model in backend
- [x] Implement backend API endpoint for saving weight and height
- [x] Update frontend to call new API on save
- [x] Test end-to-end: entering and saving updates UserProfile table
- [x] Load weight/height from UserProfile node for logged-in user
- [x] Display all profile fields (name, weight, height, gender, age, BMI) in UserDashboard from backend for current user
- [x] Add button in UserDashboard to save calculated calories to UserProfile as `totalCalories` for current user

## Current Goal
Add calorie save button & backend update

## Changes Implemented
- Added weight and height input fields on Profile screen.
- Created new Firebase RTDB path `UserProfile/{uid}` to store weight, height, BMI and timestamp.
- Implemented `handleSave` with validation, async `PUT` to above path and visual success confirmation.
- Updated `loadUserProfile` to fetch weight/height/BMI from dedicated `UserProfile` node in addition to basic user data.
- Added real-time BMI calculation on weight/height change.
- Added BMI category logic (Underweight, Normal, Overweight, Obese).
- Added colored BMI meter bar that scales with BMI value and shows category text.
- Added state resets for BMI and category when inputs cleared.
- Added styled green success message that auto-dismisses after save.
- Updated styles for meter, category text, and success message.
- UserDashboard fetches and displays all profile info for logged-in user (not just from route params or mock data).










