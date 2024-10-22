import { useState, useEffect, useMemo } from 'react';
import PageWrapper from './PageWrapper';
import { Pagination } from '../components/Pagination';
import TabBar from '../components/TabBar';
import { useAtom, useAtomValue } from 'jotai';
import { currentBatchSize, currentProjectName, currentTableName, appMode } from '../utils/jotai';
import TableTools from '../components/TableTools';
import { FormBuilderIcon, ExportIcon, NewDataIcon, TurtleIcon, LizardIcon, MammalIcon, SnakeIcon, ArthropodIcon, AmphibianIcon, SessionIcon, MergeIcon } from '../assets/icons';
import FormBuilderModal from '../modals/FormBuilderModal';
import ExportModal from '../modals/ExportModal';
import DataInputModal from '../modals/DataInputModal';
import { usePagination } from '../hooks/usePagination';
import Button from '../components/Button';
import { ProjectField } from '../components/FormFields';
import MergeSessionsModal from '../modals/MergeSessionsModal';
import Table from '../components/Table';

// Define field mappings based on page type
const FIELD_MAPPINGS = {
    Turtle: ["year", "dateTime", "site", "array", "fenceTrap", "taxa", "speciesCode", "genus", "massG", "sex", "dead", "comments"],
    Lizard: ["year", "dateTime", "site", "array", "fenceTrap", "taxa", "speciesCode", "genus", "species", "toeClipCode", "recapture", "svlMm", "vtlMm", "regenTail", "otlMm", "hatchling", "massG", "sex", "dead", "comments"],
    Mammal: ["year", "dateTime", "site", "array", "fenceTrap", "taxa", "speciesCode", "genus", "species", "massG", "sex", "dead", "comments"],
    Snake: ["year", "dateTime", "site", "array", "fenceTrap", "taxa", "speciesCode", "genus", "svlMm", "vtlMm", "massG", "sex", "dead", "comments"],
    Arthropod: ["year", "dateTime", "site", "array", "predator", "aran", "auch", "blat", "chil", "cole", "crus", "derm", "diel", "dipt", "hete", "hyma", "hymb", "lepi", "mant", "orth", "pseu", "scor", "soli", "thys", "unki", "micro", "comments"],
    Amphibian: ["year", "dateTime", "site", "array", "fenceTrap", "taxa", "speciesCode", "genus", "massG", "sex", "dead", "comments"],
    Session: ["year", "dateTime", "recorder", "handler", "site", "array", "noCaptures", "trapStatus", "comments"]
};

export default function TablePage() {
    const [entries, setEntries] = useState([]);
    const [activeTool, setActiveTool] = useState('none');
    const [rerender, setRerender] = useState(false);

    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [tableName, setTableName] = useAtom(currentTableName);
    const [batchSize, setBatchSize] = useAtom(currentBatchSize);
    const environment = useAtomValue(appMode);

    const { loadBatch, loadNextBatch, loadPreviousBatch } = usePagination(async (fetchedEntries) => {
        const transformedEntries = fetchedEntries.map((entry) => {
            const data = entry.data ? entry.data() : {};
            return {
                ...Object.fromEntries(
                    Object.entries(data).map(([key, value]) => [key, value !== undefined && value !== null ? value.toString() : "N/A"])
                )
            };
        });
        console.log("Transformed entries from Firebase before further processing:", transformedEntries);

        setEntries(transformedEntries);
    });

    useEffect(() => {
        console.log("Entries after setting state:", entries);
    }, [entries]);

    useEffect(() => {
        loadBatch();
    }, [tableName, batchSize, currentProject, environment, rerender]);

    const columns = useMemo(() => {
        const fields = FIELD_MAPPINGS[tableName] || [];
        return fields.map((field) => ({
            Header: field,
            accessor: field
        }));
    }, [tableName]);

    const tabsData = [
        { text: 'Turtle', icon: <TurtleIcon /> },
        { text: 'Lizard', icon: <LizardIcon /> },
        { text: 'Mammal', icon: <MammalIcon /> },
        { text: 'Snake', icon: <SnakeIcon /> },
        { text: 'Arthropod', icon: <ArthropodIcon /> },
        { text: 'Amphibian', icon: <AmphibianIcon /> },
        { text: 'Session', icon: <SessionIcon /> },
    ];

    return (
        <PageWrapper>
            <FormBuilderModal
                showModal={activeTool === 'formBuilder'}
                onCancel={() => setActiveTool('none')}
                onOkay={() => setActiveTool('none')}
                triggerRerender={() => setRerender(!rerender)}
            />
            <ExportModal
                showModal={activeTool === 'export'}
                onCancel={() => setActiveTool('none')}
            />
            <DataInputModal
                showModal={activeTool === 'newData'}
                closeModal={() => setActiveTool('none')}
            />
            <MergeSessionsModal
                showModal={activeTool === 'merge'}
                closeModal={() => setActiveTool('none')}
            />
            <div className="flex justify-between items-center overflow-auto dark:bg-neutral-700">
                <TabBar
                    tabs={tabsData.map((tab) => ({
                        ...tab,
                        active: tab.text === tableName,
                        onClick: () => setTableName(tab.text),
                    }))}
                />
                <div className="flex items-center px-5 space-x-5">
                    <ProjectField
                        project={currentProject.replace(/([a-z])([A-Z])/g, '$1 $2')}
                        setProject={(e) => setCurrentProject(e.replace(/ /g, ''))}
                    />
                </div>
            </div>

            <div>
                <div className="flex justify-between overflow-auto dark:bg-neutral-800">
                    <TableTools>
                        <Button
                            flexible={true}
                            text="Form Builder"
                            icon={<FormBuilderIcon />}
                            onClick={() => setActiveTool('formBuilder')}
                        />
                        <Button
                            flexible={true}
                            text="Export to CSV"
                            icon={<ExportIcon />}
                            onClick={() => setActiveTool('export')}
                        />
                        <Button
                            flexible={true}
                            text="New Data Entry"
                            icon={<NewDataIcon />}
                            onClick={() => setActiveTool('newData')}
                        />
                        <Button
                            flexible={true}
                            text="Merge Sessions"
                            icon={<MergeIcon />}
                            onClick={() => setActiveTool('merge')}
                        />
                    </TableTools>
                    <Pagination
                        loadPrevBatch={loadPreviousBatch}
                        loadNextBatch={loadNextBatch}
                    />
                </div>
                <Table columns={columns} data={entries} />
            </div>
        </PageWrapper>
    );
}
