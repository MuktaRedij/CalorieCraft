# NutriTrack Smart (Frontend)

A fully interactive, frontend-only smart food recommendation system using HTML, CSS, and JavaScript.

## Features
- **User Profiling:** Calculates BMI and Target Daily Calories (BMR + TDEE).
- **Core Tracking:** Log meals and see real-time updates on remaining caloric budget.
- **Context-Aware Recommendations:** A custom rule engine that recommends meals based on:
  - Current time of day
  - Remaining daily calories
  - User's ultimate goal (lose, maintain, gain)
- **Data Persistence:** Uses `localStorage` to keep your meals and profile data safe upon refreshing.
- **Premium UI:** Glassmorphism, deep dark aesthetics, and smooth micro-animations.

## Setup & Execution
This is a standard frontend application with no build tools or package managers required.
1. Open `index.html` in any modern web browser.
2. Ensure `style.css` and `script.js` are in the same directory.
