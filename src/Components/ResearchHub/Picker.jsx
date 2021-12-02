import React from 'react';
import Picky from 'react-picky';

const ComboPicker = (props) => {
    return (
        <Picky
            options={props.options}
            placeholder={props.placeholder}
            value={props.value}
            multiple={true}
            includeSelectAll={true}
			includeFilter={true}
			dropdownHeight={500}
            onChange={props.onChange}
            valueKey="Value"
            labelKey="Text"
			className="form-inputs"
			ref={props.pickyref}
			onOpen={() => {
				props.pickyref.current.node.children[0].classList.toggle(
					"selected"
				);
			}}
			onClose={() => {
				props.pickyref.current.node.children[0].classList.toggle(
					"selected"
				);
			}}
            renderSelectAll={({
                        className,
						style,
						filtered,
						tabIndex,
						allSelected,
						toggleSelectAll,
						multiple,
						}) => {
						// Don't show if single select or items have been filtered.
						if (multiple && !filtered) {
						  return (
							<li style={style} tabIndex={tabIndex}
							  role="option"
							  className={allSelected ? 'selected' : ''}
							  onClick={toggleSelectAll}
							  onKeyPress={toggleSelectAll}
							>
							Select all
							<span className="checkmark"></span>
							</li>
						  );
						}
					  }}
            render={({
            className,
			style,
			isSelected,
			item,
			selectValue,
			labelKey,
			valueKey,
			multiple,
			}) => {
			return (
			  <li
				style={style} // required
				className={isSelected ? 'selected' : ''} // required to indicate is selected
				key={item[valueKey]} // required
				onClick={() => selectValue(item)}
			    >{item[labelKey]}
				{/* required to select item */}
				<input type="checkbox" checked={isSelected} readOnly />
				<span className="checkmark"></span>
			  </li>
			);
		  }}
		/>
        );
}
export default ComboPicker;