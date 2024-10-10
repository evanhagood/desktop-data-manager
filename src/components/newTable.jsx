// src/components/newTable.jsx
import React from 'react';
import { useTable, useSortBy } from 'react-table';
import { EditIcon, DeleteIcon } from '../assets/icons';
import './NewTable.css'; // Add a CSS file to manage resizable columns

const NewTable = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        { columns, data },
        useSortBy // For sorting columns
    );

    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            {/* Adding resizable columns by allowing resizing via CSS */}
            <table
                {...getTableProps()}
                className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed"
                style={{ tableLayout: 'auto' }} // Allow columns to auto-size based on content
            >
                <thead className="text-xs text-gray-200 uppercase bg-gray-700 dark:bg-gray-900">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {/* Add Actions column header */}
                        <th className="px-6 py-3 resizable">Actions</th>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                className={`px-6 py-3 resizable ${column.id === 'date' ? 'no-wrap' : ''}`}
                            >
                                {column.render('Header')}
                                <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr
                            {...row.getRowProps()}
                            className="bg-gray-800 border-b border-gray-700 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            {/* Actions column with edit and delete icons */}
                            <td className="px-4 py-2 flex space-x-2">
                                <button className="text-blue-400 hover:text-blue-500">
                                    <EditIcon />
                                </button>
                                <button className="text-red-400 hover:text-red-500">
                                    <DeleteIcon />
                                </button>
                            </td>
                            {row.cells.map(cell => (
                                <td
                                    {...cell.getCellProps()}
                                    className={`px-6 py-4 text-gray-300 ${cell.column.id === 'date' ? 'no-wrap' : ''}`}
                                >
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default NewTable;
