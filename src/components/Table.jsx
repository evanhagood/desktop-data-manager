import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TableEntry } from './TableEntry';
import { TableHeading } from './TableHeading';
import { tableBody } from '../utils/variants';
import { getKey } from '../const/tableLabels';
import './Table.css';
export const Table = ({ labels, columns, entries, name, setEntries }) => {
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [columnWidths, setColumnWidths] = useState(
        labels.reduce((acc, label) => ({ ...acc, [label]: 120 }), {}) // Default width 120px
    );

    const tableRef = useRef(null);
    const resizingRef = useRef(null);

    const sortByColumn = (column) => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortedColumn(column);
        setSortDirection(newDirection);
    };

    const sortedEntries = (entries, column, direction) => {
        const sorted = [...entries];
        sorted.sort((a, b) => {
            if (getValue(a, column) > getValue(b, column)) return direction === 'asc' ? 1 : -1;
            if (getValue(a, column) < getValue(b, column)) return direction === 'asc' ? -1 : 1;
            return 0;
        });
        return sorted;
    };

    const getValue = (entry, column) => {
        const key = getKey(column, name);
        return entry.data?.()[key] || 'N/A';
    };

    const startResize = (label, e) => {
        resizingRef.current = {
            label,
            startX: e.clientX,
            startWidth: columnWidths[label],
        };
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    };

    const handleResize = (e) => {
        const { label, startX, startWidth } = resizingRef.current;
        const deltaX = e.clientX - startX;
        const newWidth = Math.max(20, startWidth + deltaX); // Enforce min width 20px

        setColumnWidths((prev) => ({
            ...prev,
            [label]: newWidth,
        }));
    };

    const stopResize = () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
    };

    useEffect(() => {
        return () => stopResize(); // Cleanup on unmount
    }, []);

    return (
        <div className="table-container" style={{ overflowX: 'auto' }}>
            <table
                ref={tableRef}
                className="w-auto border-separate border-spacing-0"
                style={{ minWidth: '100%' }}
            >
                <colgroup>
                    <col style={{ width: '80px' }} /> {/* Actions column */}
                    {labels.map((label) => (
                        <col key={label} style={{ width: `${columnWidths[label]}px` }} />
                    ))}
                </colgroup>
                <thead>
                    <tr>
                        <TableHeading label="Actions" />
                        {labels.map(
                            (label) =>
                                columns[label]?.show && (
                                    <th
                                        key={label}
                                        className="border-b border-gray-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`cursor-pointer ${
                                                    sortedColumn === label ? 'font-bold' : ''
                                                }`}
                                                onClick={() => sortByColumn(label)}
                                            >
                                                {label}
                                            </span>
                                            <div
                                                className="resize-handle"
                                                onMouseDown={(e) => startResize(label, e)}
                                            />
                                        </div>
                                    </th>
                                )
                        )}
                    </tr>
                </thead>
                <motion.tbody
                    initial="hidden"
                    animate="visible"
                    variants={tableBody}
                >
                    {sortedEntries(entries, sortedColumn, sortDirection).map((entry, index) => (
                        <tr key={index}>
                            <td className="border-b border-gray-300">Actions</td>
                            {labels.map(
                                (label) =>
                                    columns[label]?.show && (
                                        <td
                                            key={`${index}-${label}`}
                                            className="border-b border-gray-300"
                                            style={{ width: `${columnWidths[label]}px` }}
                                        >
                                            {getValue(entry, label)}
                                        </td>
                                    )
                            )}
                        </tr>
                    ))}
                </motion.tbody>
            </table>
        </div>
    );
};
