import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';

const FormField = ({ controlItem }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const renderField = () => {
    switch (controlItem.componentType || controlItem.type) {
      case 'input':
      case 'text':
      case 'email':
      case 'number':
      case 'password':
        return (
          <Controller
            name={controlItem.name}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id={controlItem.name}
                type={controlItem.type}
                placeholder={controlItem.placeholder}
              />
            )}
          />
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
                  <option key={opt.value} value={opt.value}>
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

        <Button type="submit" disabled={isBtnDisabled}>
          {buttonText || 'Submit'}
        </Button>
      </form>
    </FormProvider>
  );
}
