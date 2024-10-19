import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { TableEntry } from './TableEntry';
import { TableHeading } from './TableHeading';
import { tableBody } from '../utils/variants';
import { getKey } from '../const/tableLabels';

export const Table = ({ labels, columns, entries, name, setEntries }) => {
    // Ensure state for sorting is properly declared
    const [sortedColumn, setSortedColumn] = useState(null); // <-- This ensures the column state is defined.
    const [sortDirection, setSortDirection] = useState('asc');
    const [columnWidths, setColumnWidths] = useState(
        labels.reduce((acc, label) => ({ ...acc, [label]: 1 }), {})
    );

    const tableRef = useRef(null);

    const getValue = useCallback((entry, column) => {
        const key = getKey(column, name);
        return entry.data?.()[key] || 'N/A';
    }, [name]);

    const sortedEntries = useMemo(() => {
        if (!sortedColumn) return entries; // Ensure sortedColumn is checked
        return [...entries].sort((a, b) => {
            const valA = getValue(a, sortedColumn);
            const valB = getValue(b, sortedColumn);
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            return 0;
        });
    }, [entries, sortedColumn, sortDirection, getValue]);

    const sortByColumn = (column) => {
        const newSortDirection =
            sortedColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortedColumn(column);
        setSortDirection(newSortDirection);
    };

    const handleMouseDown = (index) => (e) => {
        const startX = e.clientX;

        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newWidths = [...columnWidths];
            newWidths[index] = Math.max(newWidths[index] + deltaX / 100, 0.1);
            setColumnWidths(newWidths);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const gridTemplate = columnWidths.map((w) => `${w}fr`).join(' ');

    return (
        <div ref={tableRef} className="table-container">
            <div
                className="table-header"
                style={{ gridTemplateColumns: gridTemplate }}
            >
                <div className="header-cell">Actions</div>
                {labels.map((label, index) => (
                    <div key={label} className="header-cell">
                        <TableHeading
                            label={label}
                            active={sortedColumn === label}
                            sortDirection={sortDirection}
                            onClick={() => sortByColumn(label)}
                        />
                        <div
                            className="resize-handle"
                            onMouseDown={handleMouseDown(index)}
                        />
                    </div>
                ))}
            </div>
            <motion.div
                className="table-body"
                initial="hidden"
                animate="visible"
                variants={tableBody}
                style={{ gridTemplateColumns: gridTemplate }}
            >
                {sortedEntries.map((entry) => (
                    <div key={entry.id} className="table-row">
                        <div className="cell"> {/* Actions */} </div>
                        {labels.map((label) => (
                            <div key={`${entry.id}-${label}`} className="cell">
                                {getValue(entry, label)}
                            </div>
                        ))}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};
