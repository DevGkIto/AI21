import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const endpoint = "https://api.ai21.com/studio/v1/j2-ultra/complete"; // Update to your specific endpoint

// Function to generate the prompt for AI21 API
const generatePrompt = (userData) => {
  return `Based on the user data provided below, generate an exercise plan for a week.

    User data:
    ${JSON.stringify(userData)}

    **Requirements:**
    - Generate **at least 3 distinct exercises** for **each weekday** (Monday through Friday).
    - Each exercise must have a specified weight that is realistic and appropriate for the user's fitness level (e.g., for "intermediate," consider weights they might typically use).
    - Ensure that the set of exercises is different for each day; do not repeat exercises on the same day or across different days.
    - Saturday and Sunday are designated rest days.

    **Output Format:**
    - Return only the response in a valid JSON array format.
    - Ensure all property names are **double-quoted**.
    - Include **only** the following fields for each exercise:
      - **"exercise"**: The name of the exercise.
      - **"sets"**: The number of sets for the exercise.
      - **"reps"**: A string representing the number of repetitions, including the weight (e.g., "8 reps at 50 lbs").
      - **"weight"**: A string denoting the weight for the exercise; provide realistic weight values based on the user's profile and avoid using placeholder values like "---". Include units if applicable (e.g., "10 lbs").
      - **"rest"**: A string indicating the rest time between sets.

    **Output Example:**
    [{"day": "Monday","exercises": [{"exercise": "Bench Press", "sets": "3", "reps": "8 reps at 50 lbs", "weight": "50 lbs","rest": "90 seconds"},
                                     {"exercise": "Deadlift", "sets": "3", "reps": "8 reps at 60 lbs", "weight": "60 lbs","rest": "90 seconds"},
                                     {"exercise": "Squat", "sets": "3", "reps": "8 reps at 70 lbs", "weight": "70 lbs","rest": "90 seconds"}]},
     {"day": "Tuesday","exercises": [{"exercise": "Overhead Press", "sets": "3", "reps": "8 reps at 40 lbs", "weight": "40 lbs","rest": "90 seconds"},
                                      {"exercise": "Pull-Up", "sets": "3", "reps": "6 reps with body weight", "weight": "body weight","rest": "90 seconds"},
                                      {"exercise": "Leg Press", "sets": "3", "reps": "10 reps at 80 lbs", "weight": "80 lbs","rest": "90 seconds"}]},
     {"day": "Wednesday","exercises": [{"exercise": "Lunges", "sets": "3", "reps": "8 reps at 30 lbs", "weight": "30 lbs","rest": "90 seconds"},
                                        {"exercise": "Bicep Curl", "sets": "3", "reps": "10 reps at 15 lbs", "weight": "15 lbs","rest": "90 seconds"},
                                        {"exercise": "Tricep Dip", "sets": "3", "reps": "8 reps with body weight", "weight": "body weight","rest": "90 seconds"}]},
     {"day": "Thursday","exercises": [{"exercise": "Leg Curl", "sets": "3", "reps": "10 reps at 50 lbs", "weight": "50 lbs","rest": "90 seconds"},
                                       {"exercise": "Chest Fly", "sets": "3", "reps": "10 reps at 20 lbs", "weight": "20 lbs","rest": "90 seconds"},
                                       {"exercise": "Seated Row", "sets": "3", "reps": "10 reps at 40 lbs", "weight": "40 lbs","rest": "90 seconds"}]},
     {"day": "Friday","exercises": [{"exercise": "Deadlift", "sets": "3", "reps": "8 reps at 60 lbs", "weight": "60 lbs","rest": "90 seconds"},
                                     {"exercise": "Push-Up", "sets": "3", "reps": "10 reps with body weight", "weight": "body weight","rest": "90 seconds"},
                                     {"exercise": "Plank", "sets": "3", "reps": "hold for 30 seconds", "weight": "---","rest": "90 seconds"}]}]

    **Validation Requirements:**
    - Ensure **every field** and its corresponding value in the JSON is **enclosed in double quotes**.
    - Thoroughly validate the generated JSON to confirm that no property or value is missing double quotes.
    - **Check** that only the following fields are present for each exercise: "exercise", "sets", "reps", "weight", and "rest".
    - Do not introduce any additional fields or information (e.g., "Multiplier").

    **Important Notes:** 
    - The output must be valid JSON with no extra text or formatting outside the JSON array.
    - Do not include any extraneous text in the output. Return only the JSON array.
    `;
};

export default async function handler(req, res) {
  try {
    console.log("AI21 API Key:", process.env.AI21_KEY);
    console.log("Request method:", req.method);
    console.log("Request body:", req.body);

    if (req.method === "POST") {
      const { height, weight, age, gender, fitnessLevel, goal, model } =
        req.body;

      const prompt = generatePrompt({
        height,
        weight,
        age,
        gender,
        fitnessLevel,
        goal,
      });

      const requestData = {
        prompt: prompt,
        temperature: 0.5,
        maxTokens: 1000,
      };

      if (model.toLowerCase() === "ai21") {
        try {
          const response = await axios.post(endpoint, requestData, {
            headers: {
              Authorization: `Bearer ${process.env.AI21_KEY}`,
              "Content-Type": "application/json",
            },
          });

          // Log the full response to inspect its structure
          console.log("AI21 response:", response.data);

          // Access the completion text from the response
          if (
            response.data &&
            response.data.completions &&
            response.data.completions.length > 0
          ) {
            const result = response.data.completions[0].data.text; // Access the generated text
            console.log("Type of the result generated: ", typeof result);
            console.log("Raw result: ", result); // Log the raw string result

            // Parse the result string into JSON
            let parsedResult;
            try {
              parsedResult = JSON.parse(result); // Parse the string into a JSON object
              console.log("Parsed result: ", parsedResult); // Log the parsed result for verification
            } catch (error) {
              console.error("Error parsing JSON:", error);
              return res
                .status(500)
                .json({ error: "Failed to parse JSON result" });
            }

            return res.json(parsedResult); // Return the parsed JSON object
          } else {
            console.error("Unexpected response structure", response.data);
            return res
              .status(500)
              .json({ error: "Unexpected response structure from AI21 API" });
          }
        } catch (error) {
          console.error(
            "AI21 API Error:",
            error.response ? error.response.data : error.message
          );
          return res.status(500).json({ error: "AI21 API call failed" });
        }
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
