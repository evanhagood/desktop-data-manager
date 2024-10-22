import React, { useState, useMemo } from "react";
import { useTable, useResizeColumns, useSortBy } from "react-table";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import TableHeading from "./TableHeading";
import { startEntryOperation } from "../utils/firestore"; // Import your existing Firebase operation

const Table = ({ columns, data, onEdit, onDelete }) => {
    const [editingRowIndex, setEditingRowIndex] = useState(null); // To track the row being edited
    const [editedData, setEditedData] = useState({}); // To store the temporary edited data

    // Memoized columns with actions
    const memoizedColumns = useMemo(() => [
        {
            Header: "Actions",
            accessor: "actions",
            disableResizing: true,
            Cell: ({ row }) => (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    {editingRowIndex === row.index ? (
                        <>
                            <button onClick={() => handleSaveClick(row.index, row.original)}>
                                <FaCheck title="Save" />
                            </button>
                            <button onClick={() => handleCancelClick(row.index)}>
                                <FaTimes title="Cancel" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleEditClick(row.index, row.original)}>
                                <FaEdit title="Edit" />
                            </button>
                            <button onClick={() => onDelete(row.original)}>
                                <FaTrash title="Delete" />
                            </button>
                        </>
                    )}
                </div>
            ),
            width: 80,
        },
        ...columns,
    ], [columns, editingRowIndex]);

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

    // Handle edit click (switches to editing mode)
    const handleEditClick = (rowIndex, rowData) => {
        setEditingRowIndex(rowIndex);
        setEditedData(rowData); // Initialize the edit data with the row's current data
    };

    // Handle save click (save the data to Firebase)
    const handleSaveClick = async (rowIndex, rowSnapshot) => {
        try {
            if (!rowSnapshot.id || !rowSnapshot.parent) {
                console.error("Missing Firestore document reference");
                return;
            }
            // Use your existing startEntryOperation to save changes
            const operationType = 'uploadEntryEdits'; // Or use other operation type as needed
            await startEntryOperation(operationType, {
                entrySnapshot: rowSnapshot,
                entryData: editedData,
                setEntryUIState: () => {},
            });

            // Exit editing mode after saving
            setEditingRowIndex(null);
            setEditedData({});
        } catch (error) {
            console.error("Error saving data to Firebase:", error);
        }
    };

    // Handle cancel click (revert changes)
    const handleCancelClick = (rowIndex) => {
        setEditingRowIndex(null);
        setEditedData({}); // Reset the edited data
    };

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
                                    {editingRowIndex === rowIndex && cell.column.id !== "actions" ? (
                                        <input
                                            value={editedData[cell.column.id] || ""}
                                            onChange={(e) =>
                                                setEditedData({
                                                    ...editedData,
                                                    [cell.column.id]: e.target.value
                                                })
                                            }
                                        />
                                    ) : (
                                        cell.render("Cell")
                                    )}
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
