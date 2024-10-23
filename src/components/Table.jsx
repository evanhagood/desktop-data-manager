import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TableEntry } from './TableEntry';
import { tableBody } from '../utils/variants';
import { getKey } from '../const/tableLabels';
import { throttle } from 'lodash';

export const Table = ({ labels, columns, entries, name, setEntries }) => {
    const initializeColumnWidths = () =>
        labels.reduce((acc, label) => ({ ...acc, [label]: 90 }), {});

    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [columnWidths, setColumnWidths] = useState(initializeColumnWidths());
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const resizingColumn = useRef(null);

    const forceUpdateLayout = useCallback(() => {
        setColumnWidths((prev) => ({ ...prev }));
    }, []);

    useEffect(() => {
        forceUpdateLayout();
        window.addEventListener('resize', forceUpdateLayout);
        return () => window.removeEventListener('resize', forceUpdateLayout);
    }, [forceUpdateLayout]);

    useEffect(() => {
        if (entries.length > 0 && !isDataLoaded) {
            setIsDataLoaded(true);
            resetColumns();
        }
    }, [entries, isDataLoaded]);

    const resetColumns = useCallback(() => {
        setSortedColumn(null);
        setSortDirection('asc');
        setColumnWidths(initializeColumnWidths());
    }, [labels]);

    const getValue = (entry, column) => {
        const key = getKey(column, name);
        return entry.data?.()[key] || 'N/A';
    };

    const sortEntries = useCallback(
        (entriesToSort, column, direction) =>
            [...entriesToSort].sort((a, b) => {
                const valueA = getValue(a, column);
                const valueB = getValue(b, column);
                if (valueA > valueB) return direction === 'asc' ? 1 : -1;
                if (valueA < valueB) return direction === 'asc' ? -1 : 1;
                return 0;
            }),
        [name]
    );

    const toggleSortDirection = useCallback((column) => {
        setSortedColumn(column);
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    }, []);

    const startResizing = (label, e) => {
        resizingColumn.current = { label, startX: e.clientX, startWidth: columnWidths[label] };
        window.addEventListener('mousemove', throttledMouseMove);
        window.addEventListener('mouseup', stopResizing);
    };

    const handleMouseMove = (e) => {
        if (!resizingColumn.current) return;
        const { label, startX, startWidth } = resizingColumn.current;
        const newWidth = Math.max(startWidth + (e.clientX - startX), 10);
        setColumnWidths((prev) => ({ ...prev, [label]: newWidth }));
    };

    const throttledMouseMove = throttle(handleMouseMove, 50);

    const stopResizing = () => {
        resizingColumn.current = null;
        cleanupResizeEvents();
    };

    const cleanupResizeEvents = () => {
        window.removeEventListener('mousemove', throttledMouseMove);
        window.removeEventListener('mouseup', stopResizing);
    };

    const confirmAndRemoveEntry = (entry) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            setEntries(entries.filter((e) => e !== entry));
        }
    };

    const sortedEntries = sortEntries(entries, sortedColumn, sortDirection);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '16px' }}>
                <button
                    onClick={resetColumns}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#90CDF4',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                    className="hover:bg-blue-500"
                >
                    Reset Columns
                </button>
            </div>
            <table
    style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
        tableLayout: 'fixed',
    }}
>
    <thead>
        <tr>
            <th scope="col" style={{ width: 100, textAlign: 'center' }}>
                Actions
            </th>
            {labels.map(
                (label) =>
                    columns[label]?.show && (
                        <th
                            key={label}
                            scope="col"
                            onClick={() => toggleSortDirection(label)}
                            style={{
                                width: columnWidths[label],
                                minWidth: '20px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                position: 'relative',
                                cursor: 'pointer',
                                borderBottom: '1px solid black',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <span>{label}</span>
                            {sortedColumn === label && (
                                <span style={{ marginLeft: '5px' }}>
                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                            )}
                            <div
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    height: '100%',
                                    width: '8px',
                                    backgroundColor: '#E2E8F0',
                                    cursor: 'col-resize',
                                    transform: 'translateX(50%)',
                                }}
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

