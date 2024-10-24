// Table.js
import React, { Component, createRef } from 'react';
import { motion } from 'framer-motion';
import { TableEntry } from './TableEntry';
import { tableBody } from '../utils/variants';
import { getKey } from '../const/tableLabels';
import './Table.css';
import { throttle } from 'lodash'; // Throttle event handlers to optimize performance

export class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortedColumn: null,
            sortDirection: 'asc',
            columnWidths: this.initializeColumnWidths(),
        };
        this.resizingColumn = createRef();
    }

    componentDidMount() {
        this.forceUpdateLayout(); // Force initial layout update
        window.addEventListener('resize', this.forceUpdateLayout);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.entries !== this.props.entries && this.props.entries.length > 0) {
            if (!this.state.isDataLoaded) {
                this.setState({ isDataLoaded: true }, this.resetColumns);
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.forceUpdateLayout);
        this.cleanupResizeEvents(); // Ensure all listeners are removed
    }

    forceUpdateLayout = () => {
        this.setState((prevState) => ({
            columnWidths: { ...prevState.columnWidths },
        }));
    };

    initializeColumnWidths = () => {
        const { labels } = this.props;
        return labels.reduce((acc, label) => {
            acc[label] = 90; // Default width: 100px
            return acc;
        }, {});
    };

    resetColumns = () => {
        this.setState({
            sortedColumn: null,
            sortDirection: 'asc',
            columnWidths: this.initializeColumnWidths(),
        });
    };

    sortEntries = (entries, column, direction) => {
        const sorted = [...entries].sort((a, b) => {
            const valueA = this.getValue(a, column);
            const valueB = this.getValue(b, column);
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            return 0;
        });
        return sorted;
    };

    toggleSortDirection = (column) => {
        this.setState((prevState) => ({
            sortedColumn: column,
            sortDirection: prevState.sortDirection === 'asc' ? 'desc' : 'asc',
        }));
    };

    getValue = (entry, column) => {
        const { name } = this.props;
        const key = getKey(column, name);
        return entry.data?.()[key] || 'N/A';
    };

    startResizing = (label, e) => {
        this.resizingColumn.current = {
            label,
            startX: e.clientX,
            startWidth: this.state.columnWidths[label],
        };
        window.addEventListener('mousemove', this.throttledMouseMove);
        window.addEventListener('mouseup', this.stopResizing);
    };

    throttledMouseMove = throttle((e) => this.handleMouseMove(e), 50);

    handleMouseMove = (e) => {
        const { label, startX, startWidth } = this.resizingColumn.current;
        const newWidth = Math.max(startWidth + (e.clientX - startX), 10); // Minimum width: 10px
        this.setState((prevState) => ({
            columnWidths: { ...prevState.columnWidths, [label]: newWidth },
        }));
    };

    stopResizing = () => {
        this.resizingColumn.current = null;
        this.cleanupResizeEvents();
    };

    cleanupResizeEvents = () => {
        window.removeEventListener('mousemove', this.throttledMouseMove);
        window.removeEventListener('mouseup', this.stopResizing);
    };
 
    confirmAndRemoveEntry = (entry) => {
        const { entries, setEntries } = this.props;
        const confirmation = window.confirm('Are you sure you want to delete this entry?');
        if (confirmation) {
            setEntries(entries.filter((e) => e !== entry));
        }
    };



    render() {
        const { labels, columns, entries, name, setEntries } = this.props;
        const { sortedColumn, sortDirection, columnWidths } = this.state;

        const sortedEntries = this.sortEntries(entries, sortedColumn, sortDirection);

        return (
            <div className="table-container">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={this.resetColumns}
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
                                            onClick={() => this.toggleSortDirection(label)}
                                        >
                                            <span>{label}</span>
                                            {sortedColumn === label && (
                                                <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                        <div
                                            className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-gray-300"
                                            style={{ transform: 'translateX(50%)' }}
                                            onMouseDown={(e) => this.startResizing(label, e)}
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
                                removeEntry={() => this.confirmAndRemoveEntry(entry)}
                                
                            />
                        ))}
                    </motion.tbody>
                </table>
            </div>
        );
    }
}
