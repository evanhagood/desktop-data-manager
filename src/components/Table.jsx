import React, { useMemo } from "react";
import { useTable, useResizeColumns, useSortBy } from "react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import TableHeading from "./TableHeading";

const Table = ({ columns, data, onEdit, onDelete }) => {

    console.log("Columns in Table component:", columns);

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

    console.log("Columns in Table component:", columns);


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
        useSortBy,
        useResizeColumns
    );

    return (
        <div style={{ width: "100%", overflowX: "auto" }}>
            <table
                {...getTableProps()}
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "sans-serif",
                    fontSize: "13px",
                    backgroundColor: "#1a1a1a",
                    color: "#d1d1d1",
                }}
            >
                {/* Table Header */}
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                style={{
                                    padding: "10px",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    backgroundColor: "#2b2b2b",
                                    borderBottom: "2px solid #444",
                                    position: "relative",
                                    whiteSpace: "nowrap",
                                    width: column.width || 150,
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
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>

                {/* Table Body */}
                <tbody {...getTableBodyProps()}>
                {rows.map((row, rowIndex) => {
                    prepareRow(row);
                    return (
                        <tr
                            {...row.getRowProps()}
                            style={{
                                backgroundColor: rowIndex % 2 === 0 ? "#333333" : "#2b2b2b",
                            }}
                        >
                            {row.cells.map(cell => (
                                <td
                                    {...cell.getCellProps()}
                                    style={{
                                        padding: "10px",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        borderBottom: "1px solid #444",
                                        width: cell.column.width || 150,
                                    }}
                                >
                                    {cell.render("Cell")}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
