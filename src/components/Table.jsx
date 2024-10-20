// Table.js
import React, { Component, createRef } from 'react';
import { motion } from 'framer-motion';
import { TableEntry } from './TableEntry';
import { tableBody } from '../utils/variants';
import { getKey } from '../const/tableLabels';
import './Table.css';
export class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortedColumn: null,
            sortDirection: 'asc',
            columnWidths: this.initializeColumnWidths(),
        };
        this.resizingColumn = createRef();
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.stopResizing = this.stopResizing.bind(this);
    }
    componentDidMount() {
        // Ensure proper layout and re-render if necessary
        this.forceUpdateLayout();  // Force initial layout update
        window.addEventListener('resize', this.forceUpdateLayout);
    }
    
    forceUpdateLayout = () => {
        // Trigger reflow by updating state, ensuring widths are applied correctly
        this.setState((prevState) => ({
            columnWidths: { ...prevState.columnWidths }
        }));
    };
    
    componentDidMount() {
        // Ensure proper layout and re-render if necessary
        window.addEventListener('resize', this.forceUpdateLayout);
    }
    componentWillUnmount() {
        // Clean up event listener
        window.removeEventListener('resize', this.forceUpdateLayout);
    }
    forceUpdateLayout = () => {
        // Force a re-render to ensure columns are resizable
        this.setState((prevState) => ({ columnWidths: { ...prevState.columnWidths } }));
    };


    initializeColumnWidths = () => {
        const { labels } = this.props;
        return labels.reduce((acc, label) => {
            acc[label] = 100; // Default width: 100px
            return acc;
        }, {});
    };
    resetColumns = () => {
        // Reset column widths and sorting state
        this.setState({
            sortedColumn: null,
            sortDirection: 'asc',
            columnWidths: this.initializeColumnWidths(), // Reset to default widths
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
        this.setState((prevState) => {
            const newDirection =
                prevState.sortedColumn === column && prevState.sortDirection === 'asc'
                    ? 'desc'
                    : 'asc';
            return {
                sortedColumn: column,
                sortDirection: newDirection,
            };
        });
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
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.stopResizing);
    };

    handleMouseMove(e) {
        const { label, startX, startWidth } = this.resizingColumn.current;
        const newWidth = Math.max(startWidth + (e.clientX - startX), 20); // Min width: 50px
        this.setState((prevState) => ({
            columnWidths: { ...prevState.columnWidths, [label]: newWidth },
        }));
    }

    stopResizing() {
        this.resizingColumn.current = null;
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.stopResizing);
    }

    render() {
        const { labels, columns, entries, name, setEntries } = this.props;
        const { sortedColumn, sortDirection, columnWidths } = this.state;

        const sortedEntries = this.sortEntries(entries, sortedColumn, sortDirection);

        return (
            <div className="table-container">
            {/* Reset Button Positioned Above the Table */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={this.resetColumns}
                    className="px-0py-0 bg-blue-300 text-white rounded hover:bg-blue-500"
                >
                    Reset Columns
                </button>
            </div>
            <table
                className="w-full border-separate border-spacing-0"
                style={{ tableLayout: 'fixed' }} // Force fixed layout for proper resizing
            >
                <thead>
                    <tr>
                        <th style={{ width: 100, textAlign:'center', paddingLeft: '0px' ,}}>Actions</th>
                        {labels.map(
                            (label) =>
                                columns[label]?.show && (
                                    <th
                                        key={label}
                                        style={{
                                            textAlign: 'center', // Force 
                                            paddingLeft: '15px', // Add padding for content alignment
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
                                            style={{ textAlign: 'center',transform: 'translateX(50%)' }}
                                            onMouseDown={(e) => this.startResizing(label, e)}
                                        />
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
                    {sortedEntries.map((entry, index) => (
                        <TableEntry
                            key={entry.id}
                            index={index}
                            entrySnapshot={entry}
                            shownColumns={labels.filter((label) => columns[label]?.show)}
                            tableName={name}
                            removeEntry={() =>
                                setEntries(entries.filter((e) => e !== entry))
                            }
                        />
                    ))}
                </motion.tbody>
            </table>
        </div>);
    }
}
