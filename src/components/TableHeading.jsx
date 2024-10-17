import React from 'react';
import classNames from 'classnames';
import { SortAscIcon, SortDescIcon } from '../assets/icons';

export const TableHeading = ({ label, active, sortDirection, onClick, width, resizerProps }) => {
    const getSortIcon = () => {
        if (active && sortDirection) {
            return sortDirection === 'asc' ? <SortAscIcon /> : <SortDescIcon />;
        }
    };

    const thClasses = classNames(
        'sticky top-0 bg-neutral-900 z-10 border-b border-neutral-800 dark:bg-neutral-950 p-2 font-semibold cursor-pointer',
        { 'text-asu-maroon dark:text-asu-gold': active }
    );

    return (
        <th
            className={thClasses}
            onClick={onClick}
            style={{
                textAlign: "center",
                width: `${width}px`, // Ensuring consistent width
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ flex: 1, marginRight: "5px" }}>{label}</span>
                <span>{getSortIcon()}</span>
            </div>
            <div
                {...resizerProps}
                style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "5px",
                    cursor: "col-resize",
                    backgroundColor: "transparent",
                    zIndex: 1,
                }}
                onClick={(e) => e.stopPropagation()} // Prevent sorting on resize click
            />
        </th>
    );
};

export default TableHeading;
