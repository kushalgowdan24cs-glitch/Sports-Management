import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  options,
  placeholder,
  wrapperClassName,
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className={clsx('flex flex-col gap-1', wrapperClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-300">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={clsx(
          'w-full bg-dark-800 border rounded-xl px-4 py-2.5 text-sm text-white',
          'outline-none transition-all duration-200 cursor-pointer',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
          error ? 'border-red-500/70' : 'border-dark-700',
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
    </div>
  );
});

Select.displayName = 'Select';
