import React, { useMemo } from "react";
import { useTable, useBlockLayout, useResizeColumns, useSortBy } from "react-table";

const Table = ({ columns, data }) => {
    // Memoize columns and data to prevent unnecessary re-renders
    const memoizedColumns = useMemo(() => columns, [columns]);
    const memoizedData = useMemo(() => data, [data]);

    const defaultColumn = useMemo(
        () => ({
            minWidth: 50,
            width: 150,
            maxWidth: 300,
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData,
            defaultColumn,
        },
        useBlockLayout,
        useResizeColumns,
        useSortBy
    );

    // Log table structure for debugging
    console.log("Columns passed to Table:", memoizedColumns);
    console.log("Data passed to Table:", memoizedData);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <div
                {...getTableProps()}
                style={{
                    width: "100%",
                    maxWidth: "1920px",
                    overflowX: "auto",
                    fontFamily: "sans-serif",
                    fontSize: "13px",
                    tableLayout: "fixed",
                    borderCollapse: "collapse",
                }}
            >
                <div>
                    {headerGroups.map(headerGroup => (
                        <div
                            {...headerGroup.getHeaderGroupProps()}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#1a1a1a",
                                color: "#d1d1d1",
                            }}
                        >
                            {headerGroup.headers.map(column => (
                                <div
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    style={{
                                        padding: "10px",
                                        fontWeight: "bold",
                                        borderBottom: "1px solid #ccc",
                                        textAlign: "center",
                                        flex: column.id === "comments" ? "2" : `0 0 ${column.width || 150}px`,
                                        position: "relative",
                                    }}
                                >
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? " 🔽"
                                                : " 🔼"
                                            : ""}
                                    </span>
                                    <div
                                        {...column.getResizerProps()}
                                        style={{
                                            display: "inline-block",
                                            width: "5px",
                                            height: "100%",
                                            position: "absolute",
                                            right: "0",
                                            top: "0",
                                            cursor: "col-resize",
                                            backgroundColor: column.isResizing ? "red" : "transparent",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div {...getTableBodyProps()} style={{ display: "table", width: "100%" }}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <div
                                {...row.getRowProps()}
                                style={{
                                    display: "flex",
                                    minHeight: "50px", // Set a consistent minimum height for each row
                                    alignItems: "center",
                                    borderBottom: "1px solid #ccc",
                                    backgroundColor: "#333333",
                                }}
                            >
                                {row.cells.map(cell => {
                                    // Debug each cell's content
                                    console.log(`Rendering cell for column: ${cell.column.id}, value: ${cell.value}`);

                                    return (
                                        <div
                                            {...cell.getCellProps()}
                                            style={{
                                                padding: "10px",
                                                color: "#e0e0e0",
                                                textAlign: "center",
                                                flex: cell.column.id === "comments" ? "2" : `0 0 ${cell.column.width || 150}px`,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {cell.render("Cell")}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Table;
