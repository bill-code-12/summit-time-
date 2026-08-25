import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg',
              'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
              'transition-colors duration-200',
              'placeholder-neutral-400',
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {helper && <p className="text-sm text-neutral-500 mt-1">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
