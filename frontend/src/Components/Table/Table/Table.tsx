import React, { useEffect, useState, ReactElement } from "react";
import { TableContext } from "../TableContext";
import { ColumnProps, TableProps } from "../Types/Props";
import { TableHeader } from "../TableHeader";
import { TableRow } from "../TableRow";
import { SortConfig } from "../Types/Sort";

const Table = <T,>({ children, dataSource }: TableProps<T>) => {
  const [filteredData, setAllFilteredData] = useState<T[]>(dataSource);

  const [columns, setColumns] = useState<ColumnProps<T>[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: "",
    direction: "none",
  });
  const [filters, setFilters] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const columnProps = React.Children.toArray(children)
      .filter((child): child is React.ReactElement<ColumnProps<T>> =>
        React.isValidElement(child)
      )
      .map((child) => child.props);

    setColumns(columnProps);
  }, [children]);

  useEffect(() => {
    const updatedData = [...dataSource];

    if (sortConfig && sortConfig.key) {
      const { key, direction } = sortConfig;
      const sortOrder = direction === "asc" ? 1 : -1;

      updatedData.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        const aNumber = Number(aValue);
        const bNumber = Number(bValue);

        if (!isNaN(aNumber) && !isNaN(bNumber)) {
          return (aNumber - bNumber) * sortOrder;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue) * sortOrder;
        }

        if (aValue < bValue) return -1 * sortOrder;
        if (aValue > bValue) return 1 * sortOrder;
        return 0;
      });
    }

    setAllFilteredData(updatedData);
  }, [dataSource, sortConfig]);

  return (
    <TableContext.Provider
      value={{
        filteredData,
        setAllFilteredData,
        columns,
        sortConfig,
        setSortConfig,
      }}
    >
      <table className="text-left w-full">
        <thead>
          <tr className="font-inter text-[18px]">
            {columns.length > 0 &&
              columns.map((column, index) => (
                <TableHeader<T> key={index} {...column} />
              ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 &&
            filteredData.map((data, index) => (
              <tr
                key={index}
                className="border-t-[1px] border-t-[rgba(255,255,255,0.5)]"
              >
                {columns.length > 0 &&
                  columns.map((column, index) => (
                    <TableRow key={index} data={data} column={column} />
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </TableContext.Provider>
  );
};

export default Table;
