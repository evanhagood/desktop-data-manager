import React, { useMemo } from "react";
import { useTable, useResizeColumns, useSortBy } from "react-table";
import { FaEdit, FaTrash } from "react-icons/fa";

const Table = ({ columns, data }) => {
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
        ...columns.map(column =>
            column.accessor === "comments"
                ? { ...column, width: 350 }
                : column
        ),
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
        useResizeColumns,
        useSortBy
    );

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <div
                {...getTableProps()}
                style={{
                    width: "100%",
                    maxWidth: "90%",
                    fontFamily: "sans-serif",
                    fontSize: "13px",
                    borderCollapse: "collapse",
                    tableLayout: "fixed",
                    overflowX: "auto",
                    backgroundColor: "#1a1a1a",
                    color: "#d1d1d1",
                }}
            >
                {/* Table Header */}
                <div>
                    {headerGroups.map(headerGroup => (
                        <div {...headerGroup.getHeaderGroupProps()} style={{ display: "flex" }}>
                            {headerGroup.headers.map(column => (
                                <div
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    style={{
                                        padding: "10px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        flex: column.accessor === "comments" ? "3" : `0 0 ${column.width || 150}px`,
                                    }}
                                >
                                    {column.render("Header")}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Table Body */}
                <div {...getTableBodyProps()} style={{ display: "table", width: "100%" }}>
                    {rows.map((row, rowIndex) => {
                        prepareRow(row);
                        return (
                            <div
                                {...row.getRowProps()}
                                style={{
                                    display: "flex",
                                    backgroundColor: rowIndex % 2 === 0 ? "#333333" : "#2b2b2b",
                                }}
                            >
                                {row.cells.map(cell => (
                                    <div
                                        {...cell.getCellProps()}
                                        style={{
                                            padding: "10px",
                                            textAlign: "center",
                                            flex: cell.column.accessor === "comments" ? "3" : `0 0 ${cell.column.width || 150}px`,
                                            whiteSpace: cell.column.accessor === "comments" ? "normal" : "nowrap",
                                            overflow: cell.column.accessor === "comments" ? "visible" : "hidden",
                                            textOverflow: cell.column.accessor === "comments" ? "clip" : "ellipsis",
                                            color: "#e0e0e0",
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
