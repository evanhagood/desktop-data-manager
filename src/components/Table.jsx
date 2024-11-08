import React, { useState, useRef, useEffect } from 'react';
import { TableEntry } from './TableEntry';
import { TableHeading } from './TableHeading';
import { tableBody } from '../utils/variants';
import { getKey } from '../const/tableLabels';
import '../styles/Table.css';

export const Table = ({ labels, columns, entries, name, setEntries }) => {
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [columnWidths, setColumnWidths] = useState({});
    const tableRef = useRef(null);
    const entriesContainerRef = useRef(null);
    const scrollbarRef = useRef(null);

    const calculateColumnWidths = () => {
        if (!tableRef.current) return;

        const measureDiv = document.createElement('div');
        measureDiv.style.position = 'absolute';
        measureDiv.style.visibility = 'hidden';
        measureDiv.style.whiteSpace = 'nowrap';
        document.body.appendChild(measureDiv);

        const newWidths = {};
        newWidths['actions'] = 60;

        labels.forEach((label, index) => {
            if (columns[label]?.show) {
                measureDiv.textContent = label;
                let maxWidth = measureDiv.offsetWidth + 12;

                entries.forEach(entry => {
                    const key = getKey(label, name);
                    const value = entry.data?.()[key] || 'N/A';
                    measureDiv.textContent = String(value);
                    const contentWidth = measureDiv.offsetWidth + 34;
                    maxWidth = Math.max(maxWidth, contentWidth);
                });

                newWidths[index] = Math.min(Math.max(maxWidth, 20), 400);
            }
        });

        document.body.removeChild(measureDiv);
        return newWidths;
    };

    useEffect(() => {
        const initialWidths = calculateColumnWidths();
        setColumnWidths(initialWidths);
    }, [entries, labels, columns]);

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

    // Sync scroll positions
    const handleEntriesScroll = () => {
        if (scrollbarRef.current && entriesContainerRef.current) {
            scrollbarRef.current.scrollLeft = entriesContainerRef.current.scrollLeft;
        }
    };

    const handleScrollbarScroll = () => {
        if (entriesContainerRef.current && scrollbarRef.current) {
            entriesContainerRef.current.scrollLeft = scrollbarRef.current.scrollLeft;
        }
    };

    return (
        <div className="table-wrapper">
            {/* Entries Container */}
            <div
                className="entries-container"
                ref={entriesContainerRef}
                onScroll={handleEntriesScroll}
            >
                <table ref={tableRef} className="w-full table-auto border-separate border-spacing-0" style={{ tableLayout: 'fixed' }}>
                    <thead>
                    <tr>
                        <th
                            className="relative p-2 font-semibold text-gray-600 border-b text-center"
                            style={{ width: columnWidths['actions'] || 50, minWidth: 50 }}
                        >
                            Actions
                        </th>
                        {labels && labels.map((label, index) =>
                                columns[label]?.show && (
                                    <th key={label} style={{ width: columnWidths[index] || 80, minWidth: 30 }}>
                                        <TableHeading
                                            label={label}
                                            active={sortedColumn === label}
                                            sortDirection={sortDirection}
                                            onClick={() => sortByColumn(label)}
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
                            removeEntry={() => setEntries(entries.filter(e => e !== entry))}
                            columnWidths={columnWidths}
                        />
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Sticky Horizontal Scrollbar */}
            <div
                className="sticky-scrollbar"
                ref={scrollbarRef}
                onScroll={handleScrollbarScroll}
            >
                <div style={{ width: tableRef.current?.scrollWidth || '100%', height: '1px' }} />
            </div>
        </div>
    );
};

export default Table;
