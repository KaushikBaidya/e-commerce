import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  errors,
  buttonText,
  isBtnDisabled,
  isSubmitting,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  function renderInputByComponentType(controlItem) {
    const value = formData[controlItem.name] || '';

    switch (controlItem.componentType) {
      case 'input':
        if (controlItem.type === 'password') {
          return (
            <div className="relative">
              <Input
                name={controlItem.name}
                id={controlItem.name}
                placeholder={controlItem.placeholder}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [controlItem.name]: e.target.value,
                  })
                }
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          );
        }
        return (
          <Input
            name={controlItem.name}
            id={controlItem.name}
            placeholder={controlItem.placeholder}
            type={controlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [controlItem.name]: e.target.value,
              })
            }
          />
        );

      case 'select':
        return (
          <Select
            onValueChange={(value) => setFormData({ ...formData, [controlItem.name]: value })}
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={controlItem.label} />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white text-foreground">
              {controlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.id}>
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            name={controlItem.name}
            id={controlItem.name}
            placeholder={controlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [controlItem.name]: e.target.value,
              })
            }
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={controlItem.name}
              checked={!!formData[controlItem.name]}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  [controlItem.name]: checked,
                })
              }
            />
            <Label htmlFor={controlItem.name}>
              {controlItem.checkboxLabel || controlItem.label}
            </Label>
          </div>
        );

      default:
        return (
          <Input
            name={controlItem.name}
            id={controlItem.name}
            placeholder={controlItem.placeholder}
            type={controlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [controlItem.name]: e.target.value,
              })
            }
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1" htmlFor={controlItem.name}>
              {controlItem.label}
            </Label>
            {renderInputByComponentType(controlItem)}
            {errors && errors[controlItem.name] && (
              <p className="text-sm text-red-500">{errors[controlItem.name]}</p>
            )}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled || isSubmitting} type="submit" className="mt-5 w-full">
        {buttonText || 'Submit'}
      </Button>
    </form>
  );
};

export default CommonForm;
