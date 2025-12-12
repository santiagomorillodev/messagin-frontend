import { useState } from 'react';

export function ToggleSwitch({ checked: checkedProp, onChange }) {
  const [checked, setChecked] = useState(checkedProp || false);

  const handleToggle = () => {
    setChecked(!checked);
    onChange && onChange(!checked);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`
        w-12 h-7 flex items-center rounded-full p-1 duration-300
        ${checked ? 'bg-green-500' : 'bg-gray-200 dark:bg-neutral-800'}
      `}
      style={{ minWidth: 48, minHeight: 28 }}
    >
      <span
        className={`
          w-5 h-5 bg-white rounded-full shadow-md duration-300
          transform ${checked ? 'translate-x-5' : 'translate-x-0'}
          border border-gray-300
        `}
      />
    </button>
  );
}