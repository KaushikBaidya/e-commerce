import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';

const FormField = ({ controlItem }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderField = () => {
    switch (controlItem.componentType || controlItem.type) {
      case 'input':
      case 'text':
      case 'email':
      case 'number':
      case 'password':
        const isPasswordField = controlItem.type === 'password';
        const inputType = isPasswordField && showPassword ? 'text' : controlItem.type;

        return (
          <div className="relative">
            <Controller
              name={controlItem.name}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={controlItem.name}
                  type={inputType}
                  placeholder={controlItem.placeholder}
                  className={isPasswordField ? 'pr-10' : ''}
                />
              )}
            />
            {isPasswordField && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        );

      case 'date':
        return (
          <div className="relative">
            <Controller
              name={controlItem.name}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={controlItem.name}
                  type="date"
                  placeholder={controlItem.placeholder}
                  className="pr-10"
                />
              )}
            />
            <Calendar
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none"
              size={18}
            />
          </div>
        );

      case 'time':
        return (
          <div className="relative">
            <Controller
              name={controlItem.name}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={controlItem.name}
                  type="time"
                  placeholder={controlItem.placeholder}
                  className="pr-10"
                />
              )}
            />
            <Clock
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none"
              size={18}
            />
          </div>
        );

      case 'datetime':
      case 'datetime-local':
        return (
          <div className="relative">
            <Controller
              name={controlItem.name}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={controlItem.name}
                  type="datetime-local"
                  placeholder={controlItem.placeholder}
                  className="pr-10"
                />
              )}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none">
              <Calendar size={16} className="mr-1" />
              <Clock size={16} />
            </div>
          </div>
        );

      case 'textarea':
        return (
          <Controller
            name={controlItem.name}
            control={control}
            render={({ field }) => (
              <Textarea {...field} id={controlItem.name} placeholder={controlItem.placeholder} />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            name={controlItem.name}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id={controlItem.name}
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="">Select an option</option>
                {controlItem.options?.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            name={controlItem.name}
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={controlItem.name}
                  checked={value || false}
                  onCheckedChange={onChange}
                />
                <Label htmlFor={controlItem.name}>{controlItem.checkboxLabel}</Label>
              </div>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-1.5">
      {controlItem.label && <Label htmlFor={controlItem.name}>{controlItem.label}</Label>}

      {renderField()}

      {/* Error Message */}
      {errors[controlItem.name] && (
        <p className="text-sm text-red-500">{errors[controlItem.name]?.message}</p>
      )}
    </div>
  );
};

export default function CommonForm({ formControls, methods, onSubmit, isBtnDisabled, buttonText }) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-4">
        {formControls.map((control) => (
          <FormField key={control.name} controlItem={control} />
        ))}

        <Button type="submit" disabled={isBtnDisabled} className="w-full">
          {buttonText || 'Submit'}
        </Button>
      </form>
    </FormProvider>
  );
}
