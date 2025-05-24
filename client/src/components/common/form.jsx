import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

const CommonForm = ({
	formControls,
	formData,
	setFormData,
	onSubmit,
	buttonText,
	isBtnDisabled,
}) => {
	function renderInputByComponentType(getControlItem) {
		let element = null;

		const value = formData[getControlItem.name] || "";
		switch (getControlItem.componentType) {
			case "input":
				element = (
					<Input
						name={getControlItem.name}
						id={getControlItem.name}
						placeholder={getControlItem.placeholder}
						type={getControlItem.type}
						value={value}
						onChange={(e) =>
							setFormData({
								...formData,
								[getControlItem.name]: e.target.value,
							})
						}
					/>
				);
				break;

			case "select":
				element = (
					<Select
						onValueChange={(value) =>
							setFormData({ ...formData, [getControlItem.name]: value })
						}
						value={value}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={getControlItem.label} />
						</SelectTrigger>
						<SelectContent className={"max-h-60 bg-white text-foreground"}>
							{getControlItem.options && getControlItem.options.length > 0
								? getControlItem.options.map((optionItem) => (
										<SelectItem key={optionItem.id} value={optionItem.id}>
											{optionItem.label}
										</SelectItem>
								  ))
								: null}
						</SelectContent>
					</Select>
				);
				break;

			case "textarea":
				element = (
					<Textarea
						name={getControlItem.name}
						id={getControlItem.name}
						placeholder={getControlItem.placeholder}
						// type={getControlItem.type}
						value={value}
						onChange={(e) =>
							setFormData({
								...formData,
								[getControlItem.name]: e.target.value,
							})
						}
					/>
				);
				break;

			case "checkbox":
				element = (
					<div className="flex items-center space-x-2">
						<Checkbox
							id={getControlItem.name}
							checked={!!formData[getControlItem.name]} // Coerce to boolean
							onCheckedChange={(checked) =>
								setFormData({
									...formData,
									[getControlItem.name]: checked,
								})
							}
						/>
						<Label htmlFor={getControlItem.name}>
							{getControlItem.checkboxLabel || getControlItem.label}
						</Label>
					</div>
				);
				break;

			default:
				element = (
					<Input
						name={getControlItem.name}
						id={getControlItem.name}
						placeholder={getControlItem.placeholder}
						type={getControlItem.type}
						value={value}
						onChange={(e) =>
							setFormData({
								...formData,
								[getControlItem.name]: e.target.value,
							})
						}
					/>
				);
				break;
		}

		return element;
	}

	return (
		<form onSubmit={onSubmit}>
			<div className="flex flex-col gap-3">
				{formControls.map((controlItem) => (
					<div className="grid w-full gap-1.5" key={controlItem.name}>
						<Label className="mb-1">{controlItem.label}</Label>
						{renderInputByComponentType(controlItem)}
					</div>
				))}
			</div>
			<Button disabled={isBtnDisabled} type="submit" className="mt-5 w-full">
				{buttonText || "Submit"}
			</Button>
		</form>
	);
};

export default CommonForm;
