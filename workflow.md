# Application Workflow

1. **Initialization:**
   - App loads and reads standard state from `localStorage`.
   - Current time is initialized and updated every minute.
   - UI reflects stored calories, BMI, and previous meals if any.

2. **User Profiling:**
   - User inputs physical metrics + goals.
   - App calculates Target Calories and BMI using standard formulas (Mifflin-St Jeor equation).
   - "Dashboard" instantly reflects limits.
   
3. **Meal Tracking:**
   - User inputs a meal name and caloric value.
   - App pushes to memory array and increments `consumedCalories`.
   - List renders item with simple ingress animation.
   - State persists gracefully to local storage.

4. **Recommendation Engine:**
   - User requests meal suggestion via 'Get Recommendation`.
   - Engine reads local time (e.g. Morning, Mid-day, Night).
   - Engine considers user goal (deficit, surplus, neutral).
   - Engine considers `targetCalories - consumedCalories`.
   - Best-fit suggestion returns dynamically with a logical explanation.
