export default function InputText({ label, id }) {
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-purple-800"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          type="text"
          name={id}
          id={id}
          className="block w-full rounded-md border-0 py-1.5 px-3 font-light shadow-sm ring-1 ring-inset ring-purple-400 placeholder:text-purple-600 focus:ring-2 focus:ring-inset focus:ring-purple-700 sm:text-sm sm:leading-6 outline-none"
        />
      </div>
    </>
  );
}
