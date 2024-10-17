import React, { useMemo } from "react";
import { useTable, useBlockLayout, useResizeColumns, useSortBy } from "react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import TableHeading from "./TableHeading";

const Table = ({ columns, data, onEdit, onDelete }) => {
    const memoizedColumns = useMemo(() => [
        {
            Header: "Actions",
            accessor: "actions",
            disableResizing: true,
            Cell: () => (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button style={{ cursor: "pointer", background: "none", border: "none" }}>
                        <FaEdit title="Edit" />
                    </button>
                    <button style={{ cursor: "pointer", background: "none", border: "none" }}>
                        <FaTrash title="Delete" />
                    </button>
                </div>
            ),
            width: 80,
        },
        ...columns,
    ], [columns]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns: memoizedColumns,
            data,
        },
        useBlockLayout,
        useSortBy,
        useResizeColumns
    );

    return (
        <div style={{ width: "100%", padding: "20px", overflowX: "auto" }}>
            <div
                {...getTableProps()}
                style={{
                    display: "table",
                    width: "100%",
                    fontFamily: "sans-serif",
                    fontSize: "13px",
                    color: "#d1d1d1",
                    backgroundColor: "#1a1a1a",
                    borderRadius: "8px",
                }}
            >
                {/* Table Header */}
                <div style={{ display: "table-header-group", width: "100%" }}>
                    {headerGroups.map(headerGroup => (
                        <div {...headerGroup.getHeaderGroupProps()} style={{ display: "flex", width: "100%" }}>
                            {headerGroup.headers.map(column => (
                                <div
                                    {...column.getHeaderProps()}
                                    style={{
                                        flex: `0 0 ${column.width || 150}px`,
                                        padding: "10px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderBottom: "2px solid #444",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#2b2b2b",
                                        position: "relative",
                                    }}
                                >
                                    <TableHeading
                                        label={column.render("Header")}
                                        active={column.isSorted}
                                        sortDirection={column.isSortedDesc ? 'desc' : 'asc'}
                                    />
                                    {column.canResize && (
                                        <div
                                            {...column.getResizerProps()}
                                            style={{
                                                width: "5px",
                                                height: "100%",
                                                position: "absolute",
                                                right: 0,
                                                top: 0,
                                                cursor: "col-resize",
                                                backgroundColor: column.isResizing ? "#ddd" : "transparent",
                                                zIndex: 1,
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Table Body */}
                <div {...getTableBodyProps()} style={{ display: "table-row-group", width: "100%" }}>
                    {rows.map((row, rowIndex) => {
                        prepareRow(row);
                        return (
                            <div
                                {...row.getRowProps()}
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    backgroundColor: rowIndex % 2 === 0 ? "#333333" : "#2b2b2b",
                                }}
                            >
                                {row.cells.map(cell => (
                                    <div
                                        {...cell.getCellProps()}
                                        style={{
                                            flex: `0 0 ${cell.column.width || 150}px`,
                                            padding: "10px",
                                            textAlign: "center",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            borderBottom: "1px solid #444",
                                            minWidth: cell.column.width || 100,
                                        }}
                                    >
                                        {cell.render("Cell")}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Table;
