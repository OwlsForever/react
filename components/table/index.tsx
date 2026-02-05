import React, { CSSProperties, useState } from "react";
import { makeClassName } from "../../src/utils/utils";
import { BasePropsNoChildren } from "../../src/types/base";

import "./style.scss";

interface Props {
	globalHeader?: { text: string, headerStyle?: CSSProperties },
	header: { [key: string]: { title: string; sortable?: boolean; headerStyle?: CSSProperties, columnStyle?: CSSProperties } };
	stickyHeader?: boolean,
	data: {
		// this added for future
		tags?: string[],
		info: { [key: string]: string | number | React.JSX.Element | undefined },
		rowStyle?: CSSProperties,
	}[];
	customHeader?: React.JSX.Element;
	tableStyle?: CSSProperties;
	noScroll?: boolean;
}

// TODO: add main header
// TODO: add vertical table
// TODO: add search
// TODO: add tags selector
// TODO: add pagination?

function Table(props: BasePropsNoChildren<Props>) {
	const { globalHeader, header, stickyHeader, data, customHeader, cssStyle, tableStyle, extraClasses, noScroll } = props;
	const [sort, setSort] = useState("");
	const [ascend, setAscend] = useState(true);

	return <table
		className={makeClassName([
			"table-component",
			stickyHeader ? "sticky-header" : "",
			extraClasses,
		])}
		style={tableStyle}
	>
		{customHeader ?? <thead>
			{globalHeader ? <tr><th colSpan={Object.keys(header).length} style={globalHeader.headerStyle}>{globalHeader.text}</th></tr> : null}
			<tr>
				{Object.entries(header).map(([key, value]) => {
					if (value.sortable) {
						return <th
							key={key}
							onClick={() => {
								if (sort == key) {
									if (ascend) setAscend(!ascend); else setSort("");
								} else {
									setSort(key);
									setAscend(true);
								}
							}}
							style={value.headerStyle}
							className={`sortable ${sort == key ? "active" : ""}`}
						><i className={`fas fa-caret-${(sort == key && !ascend) ? "up" : "down"}`} />{value.title}</th>
					} else {
						return <th style={value.headerStyle} key={key}>{value.title}</th>
					}
				})}
			</tr>
		</thead>}
		<tbody>
			{(sort ? data.sort((a, b) => {
				if (!ascend) [b, a] = [a, b];
				return ((a.info[sort] || "") > (b.info[sort] || "")) ? 1 : (((b.info[sort] || "") > (a.info[sort] || "")) ? -1 : 0);
			}) : data).map((dataRow, i) => {
				return <tr key={i}>
					{Object.entries(header).map(([key, value]) =>
						<td key={key} style={{ ...dataRow.rowStyle, ...value.columnStyle }}>{dataRow.info[key] || "-"}</td>
					)}
				</tr>
			})}
		</tbody>
	</table>
}

export default Table;