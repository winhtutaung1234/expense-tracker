import React, { ReactElement } from 'react';

type TableProps<T> = {
    children: ReactElement[];
    dataSource: T[];
};

export default TableProps;