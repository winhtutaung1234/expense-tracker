import { useContext, useEffect, useState, useCallback } from 'react';
import { TableContext } from '../TableContext';
import { ColumnProps } from '../Types/Props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import TableContextType from '../Types/TableContextType';
import { SortDirection } from '../Types/Sort';

const TableHeader = <T,>({ title, width, sort, dataIndex }: ColumnProps<T>) => {
    const [sortState, setSortState] = useState<SortDirection | null>(null);
    const { sortConfig, setSortConfig } = useContext<TableContextType<T>>(TableContext);

    useEffect(() => {
        if (sortConfig && sortConfig.key === dataIndex) {
            setSortState(sortConfig.direction);
        } else {
            setSortState(null);
        }
    }, [sortConfig, dataIndex]);

    const getNextSortState = (currentSort: SortDirection | null): SortDirection => {
        switch (currentSort) {
            case 'asc':
                return 'desc';
            case 'desc':
                return 'none';
            default:
                return 'asc';
        }
    };

    const handleClick = useCallback(() => {
        if (sort) {
            setSortConfig(prevSortConfig => {
                const newDirection = getNextSortState(prevSortConfig.direction);
                if (newDirection === "none") {
                    return { key: "", direction: "none" };
                }
                if (prevSortConfig.key && prevSortConfig.key !== dataIndex) {
                    return { key: dataIndex as keyof T, direction: "asc" }
                }
                return { key: dataIndex as keyof T, direction: newDirection };
            });
            setSortState(prev => getNextSortState(prev));
        }
    }, [dataIndex, sort, setSortConfig]);

    const getSortIcon = () => {
        if (!sort) return null;
        switch (sortState) {
            case 'asc':
                return <FontAwesomeIcon icon={faSortUp} className='text-white opacity-50' />;
            case 'desc':
                return <FontAwesomeIcon icon={faSortDown} className='text-white opacity-50' />;
            default:
                return <FontAwesomeIcon icon={faSort} className='text-white opacity-50' />;
        }
    };

    return (
        <th className={`font-inter text-[18px] pb-4 px-3 pt-3 ${sort && "cursor-pointer"}`} style={{ width: width || 'auto' }}>
            <div className='flex justify-between items-center gap-2' onClick={handleClick}>
                <p>{title}</p>
                {getSortIcon()}
            </div>
        </th>
    );
};

export default TableHeader; 
