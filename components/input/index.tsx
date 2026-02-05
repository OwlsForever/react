import React, { ChangeEvent, ComponentProps, DOMAttributes, ElementType } from "react";
import { BasePropsNoChildren } from "../../src/types/base";
import { makeClassName } from "../../src/utils/utils";

import "./style.scss";

type InputOrTextarea = "input" | "textarea";

type Props<T extends InputOrTextarea> = {
	id?: string,
	placeholder?: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	syntheticEvents?: DOMAttributes<HTMLInputElement | HTMLTextAreaElement>;
	otherAttributes?: ComponentProps<T>;
	inputTag?: T;
}

function Input<T extends InputOrTextarea = "input">(props: BasePropsNoChildren<Props<T>>) {
	const {
		id, placeholder, value, onChange, syntheticEvents, otherAttributes, inputTag,
		extraClasses, cssStyle,
	} = props;

	const InputTag = (inputTag || "input") as ElementType;

	return <InputTag
		id={id ?? ""}
		className={makeClassName([
			"input-component",
			extraClasses,
		])}
		onChange={onChange}
		{...syntheticEvents}
		{...otherAttributes}
		value={value}
		placeholder={placeholder}
		style={cssStyle}
	/>
}

export default Input;