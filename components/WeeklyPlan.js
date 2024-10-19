import CustomTable from "@/components/CustomTable";

const ExerciseDay = ({ day }) => (
  <div className="w-full text-xl text-center py-2 font-medium border-b text-secondary-main">
    {day}
  </div>
);

// // Function to fix JSON with missing quotes
// function fixJSON(jsonString) {
//   // Step 1: Fix property names without quotes by using regex to add quotes around them.
//   let fixedString = jsonString.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

//   // Step 2: Ensure that any strings (e.g., text after colons) are properly quoted.
//   fixedString = fixedString.replace(
//     /:\s*([^"\d\[\]\{\},\s]+)(\s*[,\}\]])/g,
//     ': "$1"$2'
//   );

//   // Step 3: Trim and ensure no trailing commas in objects or arrays.
//   fixedString = fixedString.replace(/,\s*([\}\]])/g, "$1");

//   try {
//     // Step 4: Parse the string to verify it's valid JSON.
//     const parsed = JSON.parse(fixedString);
//     return JSON.stringify(parsed, null, 2); // Pretty print JSON for readability.
//   } catch (error) {
//     console.error("Invalid JSON structure after fix attempt:", error);
//     return null; // Return null if parsing fails after the fix attempt.
//   }
// }

// // Function to parse the exercise string
// function parseExerciseString(exerciseString) {
//   // Clean up the string to make it a valid JSON array
//   const cleanString = exerciseString
//     .replace(/\\n/g, "") // Remove newline characters
//     .replace(/\\"/g, '"') // Replace escaped quotes with normal quotes
//     .trim(); // Trim leading/trailing whitespace

//   console.log("Clean String: ", cleanString);

//   // Fix JSON if necessary
//   const fixedString = fixJSON(cleanString);
//   if (!fixedString) {
//     throw new Error("Invalid JSON structure after applying fixJSON.");
//   }

//   console.log("Fixed String: ", fixedString);

//   // Now, we can parse it as JSON
//   const parsedData = JSON.parse(fixedString);

//   console.log("Parsed Data: ", parsedData);

//   // Return the parsed data
//   return parsedData.map(({ day, exercises }) => ({
//     day,
//     exercises,
//   }));
// }

export default function WeeklyPlan({ data }) {
  // Log to verify data structure
  // console.log("data type: ", typeof data);
  // console.log("data.result Type:", typeof data.result);

  // console.log("Logging the Data: ", data); // Check the incoming data structure

  // Check if data or data.result is present
  if (!data) {
    return <div>No exercises available for this week.</div>; // Handle empty data case
  }

  // // Parse the exercises data from the result string
  // let exercisesData;
  // try {
  //   exercisesData = parseExerciseString(data);
  // } catch (error) {
  //   console.error("Error parsing exercise data:", error);
  //   return <div>Error parsing exercise data.</div>; // Handle parsing errors
  // }

  // Render the exercises data
  return (
    <div>
      {data.map(({ day, exercises }) => (
        <div
          key={day}
          className="bg-slate-50 mb-10 shadow-md border border-slate-300 rounded-xl"
        >
          <ExerciseDay day={day} />
          <CustomTable exercises={exercises} />
        </div>
      ))}
    </div>
  );
}
