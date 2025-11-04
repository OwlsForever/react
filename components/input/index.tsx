import React, { DOMAttributes } from "react";
import { BaseProps } from "../../src/types/base";

import "./style.scss";

interface Props {
	placeholder?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	syntheticEvents?: DOMAttributes<HTMLInputElement>;
}

function Input(props: BaseProps<Props>) {
	const { placeholder, value, onChange, syntheticEvents } = props;

	return <input
		className="input-component"
		onChange={onChange}
		{...syntheticEvents}
		value={value}
		placeholder={placeholder}
	/>
}

export default Input;