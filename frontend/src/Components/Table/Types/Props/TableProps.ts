import React from 'react';

type TableProps<T> = {
    children: React.ReactNode;
    dataSource: T[];
};

export default TableProps;