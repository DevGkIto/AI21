import CustomTable from "@/components/CustomTable";

const ExerciseDay = ({ day }) => (
  <div className="w-full text-xl text-center py-2 font-medium border-b text-purple-800">
    {day}
  </div>
);

export default function WeeklyPlan({ data }) {
  return (
    <div>
      {data.map(({ day, exercises }) => (
        <div
          key={day}
          className="mb-8 shadow-xl border border-slate-300 rounded-lg"
        >
          <ExerciseDay day={day} />
          <CustomTable exercises={exercises} />
        </div>
      ))}
    </div>
  );
}
