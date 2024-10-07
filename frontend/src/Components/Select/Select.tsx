import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SelectProps } from '../../Types/Props/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Select = <T,>(SelectProps: SelectProps<T>) => {
    const { allOptions, dataIndex, displayKey, onChange, value, className, style, search = false } = SelectProps;
    const [selectedValue, setSelectedValue] = useState<T | null>(null);
    const [dropDownOpen, setDropDownOpen] = useState<"open" | "close" | "none">("none");
    const [filteredOptions, setFilterdOptions] = useState<T[]>(allOptions);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLDivElement>(null); // Ref for the toggle element
    const [searchValue, setSearchValue] = useState("");

    const closeDropDown = () => {
        if (dropDownOpen !== "none") {
            setDropDownOpen("close");
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropDownRef.current &&
                !dropDownRef.current.contains(event.target as Node) &&
                toggleRef.current &&
                !toggleRef.current.contains(event.target as Node) &&
                dropDownOpen === "open"
            ) {
                closeDropDown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener("scroll", closeDropDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("scroll", closeDropDown);
        }
    }, [dropDownOpen])

    useEffect(() => {
        setFilterdOptions(allOptions)
    }, [allOptions])

    useEffect(() => {
        const foundValue = allOptions.find(option => option[dataIndex] == value);
        if (foundValue) setSelectedValue(foundValue);
    }, [value, allOptions, dataIndex]);

    const toggleDropDown = () => {
        setDropDownOpen(prevState => prevState === "open" ? "close" : "open");
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }

    useEffect(() => {
        setFilterdOptions(() => {
            const newOptions = allOptions.filter((option) => {
                const displayValue = String(option[displayKey]).toLowerCase();
                return displayValue.startsWith(searchValue.toLowerCase())
            })
            return newOptions;
        })
    }, [searchValue])

    const handleClick = (id: string | number) => {
        onChange(id);
        setDropDownOpen("close");
        setSearchValue("");
    }

    return (
        <div className={`relative w-full`}>
            <div
                ref={toggleRef}
                onClick={toggleDropDown}
                className={`w-full rounded-md ps-4 pe-7 appearance-none shadow-lg font-montserrat bg-light-gray flex items-center cursor-pointer ${className}`}
                style={{ ...style }}
            >
                {selectedValue ? String(selectedValue[displayKey]) : 'No selection'}
            </div>
            <div
                className={`pointer-events-none absolute inset-y-0 right-3 flex items-center`}
                style={{ ...style }}
            >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            <div
                ref={dropDownRef}
                className={`absolute left-0 right-0 mt-3 max-h-[25svh] bg-dark-gray rounded-lg shadow-lg z-10 overflow-y-scroll scrollBar scrollBarWidth3
                     ${dropDownOpen === "open" ? "animate-openDropDown" : ""}
                     ${dropDownOpen === "close" ? "animate-closeDropDown" : ""}
                     ${dropDownOpen === "close" || dropDownOpen === "none" ? dropDownOpen === "close" ? "" : "hidden" : "flex-col"}
                     `}>
                {
                    search && (
                        <div className='sticky top-0 bg-dark-gray'>
                            <div className='p-2'>
                                <input
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    className='w-full rounded-md ps-4 appearance-none shadow-lg font-montserrat bg-light-gray placeholder:text-white placeholder:opacity-50 py-1'
                                    placeholder={String(displayKey)[0].toUpperCase() + String(displayKey).slice(1)}
                                />
                                <FontAwesomeIcon icon={faSearch} className='opacity-50 absolute right-5 top-1/2 -translate-y-1/2' />
                            </div>
                        </div>
                    )
                }
                <div className='flex flex-col gap-2 p-3'>
                    {filteredOptions.map(option => (
                        <p className='cursor-pointer rounded-sm' onClick={() => handleClick(String(option[dataIndex]))} key={String(option[dataIndex])}>{String(option[displayKey])}</p>
                    ))}

                    {filteredOptions.length === 0 && (
                        <p className='opacity-50'>No Matches Found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Select;
