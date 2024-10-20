export default function CustomSelect({ label, id, values }) {
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-light leading-6 text-purple-800"
      >
        {label}
      </label>
      <div className="mt-2">
        <select
          id={id}
          name={id}
          className="block w-full rounded-md border-0 py-2 px-3 font-light shadow-sm ring-1 ring-inset ring-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-700 sm:max-w-xs sm:text-sm sm:leading-6 outline-none"
        >
          <option value="" disabled>
            Select an option
          </option>{" "}
          {/* Optional placeholder */}
          {values.map(({ value, title }) => (
            <option key={value} value={value}>
              {title}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
