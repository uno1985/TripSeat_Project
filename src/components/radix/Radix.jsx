/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import './radix.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Regions } from '../../data/constants';
import { DateRange } from 'react-date-range';
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from 'react-icons/fa';
import { MdOutlineCalendarMonth } from "react-icons/md";

function RegionSelector({
    regions,
    onSelect,
    className
}) {
    return (
        <Popover.Root>
        <Popover.Trigger asChild>
            <button className={"trigger-btn d-flex align-items-center" + ` ${className}`}>
                <div className="selector-text flex-grow-1 text-start">
                {
                    regions.length > 0 
                    ? regions.join(', ')
                    : '請選擇'
                }
                </div>
                <IoIosArrowDown />
            </button>
        </Popover.Trigger>
        <Popover.Portal>
            <Popover.Content className="popover-content" sideOffset={5}>
            {Object.entries(Regions).map(([regionName, cities]) => (
                <div key={regionName} className="region-group">
                <h4 className="region-title">{regionName}</h4>
                <div className="city-grid">
                    {cities.map((city) => {
                        const isSelected = regions.includes(city.value);
                        
                        return (
                            <button
                                key={city.value}
                                className={`city-btn ${isSelected ? 'selected' : ''}`}
                                data-value={city.value}
                                onClick={(e) => onSelect(e, isSelected)} >
                                {city.value}
                            </button>
                        );
                    })}
                </div>
                </div>
            ))}
            
            {/* 這是 Popover 的小箭頭 (選用) */}
            <Popover.Arrow className="popover-arrow" />
            </Popover.Content>
        </Popover.Portal>
        </Popover.Root>
    );
}

function DatePicker({
        editable,
        onDateChange,
        className,
        fontStyle
    }) {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });
    const [isSelected, setIsSelected] = useState(false);

    function handleSelect(e) {
        if (e?.selection) {
            setIsSelected(true);
            setDateRange(e.selection);
        }

        onDateChange(e);
    }

    function handleDateDisplay() {
        if (!isSelected) {
            return '';
        }

        const startDate = dateRange.startDate.toLocaleDateString();
        const endDate = dateRange.endDate.toLocaleDateString();

        if (startDate === endDate) {
            return startDate;
        }
        else {
            return `${startDate} - ${endDate}`;
        }
    }

    return (
        <>
        <div className="datePicker">
            <Popover.Root>
                <Popover.Trigger asChild>
                    <button className={`datePicker-input d-flex ${className}`}>
                        <div className={`flex-grow-1 ${fontStyle}`}>
                            {handleDateDisplay()}
                        </div>
                        <MdOutlineCalendarMonth className="h-100 w-auto" color="#5b5b5b"/>
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content>
                        <DateRange
                            ranges={[dateRange]}
                            moveRangeOnFirstSelection={false}
                            onChange={(e) => {handleSelect(e)}}
                            rangeColors={["#E78F0C"]}
                            months={1}
                            editableDateInputs={!!editable}
                            direction="horizontal" />
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </div>
        </>
    );
}

function MultiSelector({
    options = [],
    selecteds = [],
    onSelect = () => {}, // The user will handle this
    placeholder = "請選擇",
    className = ""
}) {
    const displayValue = selecteds.length > 0 ? selecteds.join(', ') : placeholder;

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button className={`MultiSelectTrigger ${className}`}>
                    <span>{displayValue}</span>
                    <IoIosArrowDown />
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="MultiSelectContent" sideOffset={5} align="start">
                    {options.map((option, index) => {
                        const isSelected = selecteds.includes(option.value);
                        return (
                            <div key={index}
                                className="MultiSelectItem"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSelect(option.value);
                                }}>
                                <Checkbox.Root
                                    className="MultiSelectCheckbox"
                                    checked={isSelected}
                                    id={`c${index}`} >
                                    <Checkbox.Indicator className="MultiSelectCheckboxIndicator">
                                        <FaCheck />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <label className="MultiSelectLabel" htmlFor={`c${index}`}>
                                    {option?.text}
                                </label>
                            </div>
                        );
                    })}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

export const Radix = {
    RegionSelector: RegionSelector,
    DateRangePicker: DatePicker,
    MultiSelector: MultiSelector,
}
