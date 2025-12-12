export default function InputForm({labelComponent, typeComponent, valueComponent, onChangeComponent}) {
  return (
    <div className="m-4 px-4 py-1 border rounded-md">
      <label htmlFor={labelComponent} className="block text-sm font-medium text-gray-400 p-0 m-0">
        {labelComponent}
      </label>
      <input
        type={typeComponent}
        id={labelComponent}
        defaultValue={valueComponent}
        onChange={onChangeComponent}
        className="block w-full p-0 rounded-md shadow-sm text-sm outline-0"
      />
    </div>
  );
}
