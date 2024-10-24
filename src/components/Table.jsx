import React, { useState, useRef } from 'react';
import { TableEntry } from './TableEntry';
import { TableHeading } from './TableHeading';
import { tableBody } from '../utils/variants';
import { getKey } from '../const/tableLabels';

export const Table = ({ labels, columns, entries, name, setEntries }) => {
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [columnWidths, setColumnWidths] = useState({});
    const [resizing, setResizing] = useState(null);
    const tableRef = useRef(null);
    const startXRef = useRef(null);
    const startWidthRef = useRef(null);

    const sortedEntries = (entries, column, direction) => {
        const sortedEntries = [...entries];
        sortedEntries.sort((a, b) => {
            if (getValue(a, column) > getValue(b, column)) {
                return (direction === 'asc') ? 1 : -1;
            }
            if (getValue(a, column) < getValue(b, column)) {
                return (direction === 'asc') ? -1 : 1;
            }
            return 0;
        });
        return sortedEntries;
    };

    const sortByColumn = (column) => {
        const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortedColumn(column);
        setSortDirection(newSortDirection);
    };

    const getValue = (entry, column) => {
        const key = getKey(column, name);
        const value = entry.data?.()[key] || 'N/A';
        return value;
    };

    const startResizing = (e, columnIndex) => {
        setResizing(columnIndex);
        startXRef.current = e.clientX;
        startWidthRef.current = columnWidths[columnIndex] || (columnIndex === 'actions' ? 50 : 80);

        e.preventDefault();
        e.stopPropagation();
    };

    const handleMouseMove = (e) => {
        if (resizing === null) return;

        const currentWidth = startWidthRef.current;
        const mouseMove = e.clientX - startXRef.current;
        const newWidth = Math.max(20, currentWidth + mouseMove);

        requestAnimationFrame(() => {
            setColumnWidths(prev => ({
                ...prev,
                [resizing]: newWidth
            }));
        });

        e.preventDefault();
    };
    const stopResizing = () => {
        setResizing(null);
        startXRef.current = null;
        startWidthRef.current = null;
    };
    React.useEffect(() => {
        if (resizing !== null) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', stopResizing);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', stopResizing);
            };
        }
    }, [resizing]);

    const defaultWidths = {
        actions: 50,
        ...labels.reduce((acc, _, index) => ({
            ...acc,
            [index]: 80
        }), {})
    };

    // Add reset function
    const resetColumnWidths = () => {
        setColumnWidths(defaultWidths);
    };


    return (
        <div className="w-full overflow-x-auto relative border-b border-neutral-400">
            <div className="flex justify-end mb-1"> {/* Add button container */}
                <button
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded border border-gray-300 transition-colors"
                    onClick={resetColumnWidths}
                >
                    Reset Columns
                </button>
            </div>
            <div className="min-w-full inline-block">
                <table
                    ref={tableRef}
                    className="w-full table-auto border-separate border-spacing-0"
                    style={{ tableLayout: 'fixed' }}
                >
                    <thead>
                    <tr>
                        <th
                            className="relative p-2 font-semibold text-gray-600 border-b text-center"
                            style={{
                                width: columnWidths['actions'] || 50,
                                minWidth: 50,
                                position: 'relative' // Ensure positioning context
                            }}
                        >
                            Actions
                            <div
                                className="absolute top-0 h-full cursor-col-resize hover:bg-blue-400 z-10"
                                style={{
                                    right: '-3px',
                                    width: '6px',  // Wider handle
                                    transform: 'translateX(50%)', // Center the handle between columns
                                }}
                                onMouseDown={(e) => startResizing(e, 'actions')}
                            />
                        </th>
                        {labels && labels.map((label, index) =>
                                columns[label]?.show && (
                                    <th
                                        key={label}
                                        className="relative"
                                        style={{
                                            width: columnWidths[index] || 80,
                                            minWidth: 30,
                                            position: 'relative' // Ensure positioning context
                                        }}
                                    >
                                        <TableHeading
                                            label={label}
                                            active={sortedColumn === label}
                                            sortDirection={sortDirection}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                sortByColumn(label);
                                            }}
                                        />
                                        <div
                                            className="absolute top-0 h-full cursor-col-resize hover:bg-red-400 z-10"
                                            style={{
                                                right: '-3px',
                                                width: '16px',  // Wider handle
                                                transform: 'translateX(50%)', // Center the handle between columns
                                            }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                startResizing(e, index);
                                            }}
                                        />
                                    </th>
                                )
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedEntries(entries, sortedColumn, sortDirection).map((entry, index) => (
                        <TableEntry
                            index={index}
                            key={entry.id}
                            entrySnapshot={entry}
                            shownColumns={[...labels].filter(label => columns[label]?.show)}
                            tableName={name}
                            removeEntry={() => {
                                setEntries(entries.filter(e => e !== entry));
                            }}
                            columnWidths={columnWidths}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;