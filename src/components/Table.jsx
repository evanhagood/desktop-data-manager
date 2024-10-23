// Table.js
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TableEntry } from './TableEntry';
import { tableBody } from '../utils/variants';
import { getKey } from '../const/tableLabels';
import './Table.css';
import { throttle } from 'lodash';

export const Table = ({ labels, columns, entries, name, setEntries }) => {
    const initializeColumnWidths = () => {
        return labels.reduce((acc, label) => {
            acc[label] = 90;
            return acc;
        }, {});
    };

    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [columnWidths, setColumnWidths] = useState(initializeColumnWidths());
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const resizingColumn = useRef(null);

    const forceUpdateLayout = () => {
        setColumnWidths(prev => ({ ...prev }));
    };

    useEffect(() => {
        forceUpdateLayout();
        window.addEventListener('resize', forceUpdateLayout);
        return () => {
            window.removeEventListener('resize', forceUpdateLayout);
            cleanupResizeEvents();
        };
    }, []);

    useEffect(() => {
        if (entries.length > 0 && !isDataLoaded) {
            setIsDataLoaded(true);
            resetColumns();
        }
    }, [entries, isDataLoaded]);

    const cleanupResizeEvents = () => {
        window.removeEventListener('mousemove', throttledMouseMove);
        window.removeEventListener('mouseup', stopResizing);
    };

    const resetColumns = () => {
        setSortedColumn(null);
        setSortDirection('asc');
        setColumnWidths(initializeColumnWidths());
    };

    const getValue = (entry, column) => {
        const key = getKey(column, name);
        return entry.data?.()[key] || 'N/A';
    };

    const sortEntries = (entriesToSort, column, direction) => {
        const sorted = [...entriesToSort].sort((a, b) => {
            const valueA = getValue(a, column);
            const valueB = getValue(b, column);
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            return 0;
        });
        return sorted;
    };

    const toggleSortDirection = (column) => {
        setSortedColumn(column);
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const startResizing = (label, e) => {
        resizingColumn.current = {
            label,
            startX: e.clientX,
            startWidth: columnWidths[label],
        };
        window.addEventListener('mousemove', throttledMouseMove);
        window.addEventListener('mouseup', stopResizing);
    };

    const handleMouseMove = (e) => {
        if (!resizingColumn.current) return;
        const { label, startX, startWidth } = resizingColumn.current;
        const newWidth = Math.max(startWidth + (e.clientX - startX), 10);
        setColumnWidths(prev => ({ ...prev, [label]: newWidth }));
    };

    const throttledMouseMove = throttle(handleMouseMove, 50);

    const stopResizing = () => {
        resizingColumn.current = null;
        cleanupResizeEvents();
    };

    const confirmAndRemoveEntry = (entry) => {
        const confirmation = window.confirm('Are you sure you want to delete this entry?');
        if (confirmation) {
            setEntries(entries.filter((e) => e !== entry));
        }
    };

    const sortedEntries = sortEntries(entries, sortedColumn, sortDirection);

    return (
        <div className="table-container">
            <div className="flex justify-end mb-4">
                <button
                    onClick={resetColumns}
                    className="px-2 py-1 bg-blue-300 text-white rounded hover:bg-blue-500"
                >
                    Reset Columns
                </button>
            </div>
            <table
                className="w-full border-separate border-spacing-0"
                style={{ tableLayout: 'fixed' }}
            >
                <thead>
                    <tr>
                        <th style={{ width: 100, textAlign: 'center' }}>Actions</th>
                        {labels.map((label) =>
                            columns[label]?.show && (
                                <th
                                    key={label}
                                    style={{
                                        width: columnWidths[label],
                                        minWidth: '20px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        position: 'relative',
                                    }}
                                    className="cursor-pointer border-b"
                                >
                                    <div
                                        className="flex items-center justify-start"
                                        onClick={() => toggleSortDirection(label)}
                                    >
                                        <span>{label}</span>
                                        {sortedColumn === label && (
                                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                    <div
                                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-gray-300"
                                        style={{ transform: 'translateX(50%)' }}
                                        onMouseDown={(e) => startResizing(label, e)}
                                    />
                                </th>
                            )
                        )}
                    </tr>
                </thead>
                <motion.tbody initial="hidden" animate="visible" variants={tableBody}>
                    {sortedEntries.map((entry, index) => (
                        <TableEntry
                            key={entry.id}
                            index={index}
                            entrySnapshot={entry}
                            shownColumns={labels.filter((label) => columns[label]?.show)}
                            tableName={name}
                            removeEntry={() => confirmAndRemoveEntry(entry)}
                        />
                    ))}
                </motion.tbody>
            </table>
        </div>
    );
};
