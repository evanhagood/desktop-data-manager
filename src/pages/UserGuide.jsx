export default function UserGuide() {
    const styles = {
        container: {
            fontFamily: "'Arial', sans-serif",
            margin: "20px auto",
            maxWidth: "800px",
            lineHeight: "1.6",
        },
        header: {
            color: "white",
            textAlign: "center",
            marginBottom: "30px",
        },
        subHeader: {
            color: "white",
            marginTop: "30px",
            borderBottom: "2px solid #ecf0f1",
            paddingBottom: "10px",
        },
        tableOfContents: {
            padding: "20px",
        },
        list: {
            listStyleType: "circle",
            paddingLeft: "20px",
        },
        subList: {
            listStyleType: "square",
            paddingLeft: "20px",
        },
        image: {
            display: "block",
            margin: "20px auto",
            maxWidth: "100%",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        link: {
            color: "#2980b9",
            textDecoration: "none",
        },
        paragraph: {
            marginTop: "15px",
            marginBottom: "15px",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Field Day App User Guide</h1>
            <p style={styles.paragraph}>
                Welcome to the Field Day App User Guide. This guide will help you understand how to use the Field Day application to its full potential.
            </p>

            <h2 style={styles.subHeader}>Table of Contents</h2>
            <div style={styles.tableOfContents}>
                <ol>
                    <li>
                        <a href="#introduction" style={styles.link}>
                            Introduction
                        </a>
                    </li>
                    <li>
                        <a href="#getting-started" style={styles.link}>
                            Getting Started
                        </a>
                        <ul style={styles.subList}>
                            <li>
                                <a href="#creating-an-account" style={styles.link}>
                                    Creating an Account
                                </a>
                            </li>
                            <li>
                                <a href="#logging-in" style={styles.link}>
                                    Logging In
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#application-features" style={styles.link}>
                            Application Features
                        </a>
                        <ul style={styles.subList}>
                            <li>
                                <a href="#dashboard-overview" style={styles.link}>
                                    Dashboard Overview
                                </a>
                            </li>
                            <li>
                                <a href="#data-source-tab" style={styles.link}>
                                    Data Source Tab
                                </a>
                            </li>
                            <li>
                                <a href="#managing-entries" style={styles.link}>
                                    Managing Entries
                                </a>
                            </li>
                            <li>
                                <a href="#editing-table-view" style={styles.link}>
                                    Editing The Table View
                                </a>
                            </li>
                            <li>
                                <a href="#searching-entries" style={styles.link}>
                                    Searching For Entries
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#data-handling" style={styles.link}>
                            Detailed Instructions for Data Handling
                        </a>
                        <ul style={styles.subList}>
                            <li>
                                <a href="#exporting-reports" style={styles.link}>
                                    Exporting Reports
                                </a>
                            </li>
                            <li>
                                <a href="#what-is-a-session" style={styles.link}>
                                    What is a Session?
                                </a>
                            </li>
                            <li>
                                <a href="#merging-sessions" style={styles.link}>
                                    Merging Sessions
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#troubleshooting" style={styles.link}>
                            Troubleshooting
                        </a>
                        <ul style={styles.subList}>
                            <li>
                                <a href="#common-issues" style={styles.link}>
                                    Common Issues
                                </a>
                            </li>
                            <li>
                                <a href="#faqs" style={styles.link}>
                                    FAQs
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#feedback" style={styles.link}>
                            Feedback
                        </a>
                        <ul style={styles.subList}>
                            <li>
                                <a href="#providing-feedback" style={styles.link}>
                                    Providing Feedback
                                </a>
                            </li>
                        </ul>
                    </li>
                </ol>
            </div>

            <h2 id="introduction" style={styles.subHeader}>
                Introduction
            </h2>
            <p style={styles.paragraph}>
                Welcome to Field Day! Field Day is an application sponsored by Dr. Heather Bateman, a biologist and researcher at Arizona State University (ASU).
            </p>
            <p style={styles.paragraph}>
                The app is developed and maintained by ASU Software Engineering students as part of their Capstone course (SER 401 and 402).
            </p>
            <p style={styles.paragraph}>Field Day consists of three platforms:</p>
            <ul style={styles.list}>
                <li>Field Day Desktop App</li>
                <li>Field Day PWA (mobile application)</li>
                <li>Field Day Flex (currently in development)</li>
            </ul>
            <p style={styles.paragraph}>This guide focuses on the Desktop application.</p>

            <h2 id="getting-started" style={styles.subHeader}>
                Getting Started
            </h2>
            <h3 id="creating-an-account">Creating an Account</h3>
            <p style={styles.paragraph}>
                Field Day is currently set up to only allow ASU emails to log in. Please sign in with your ASURITE ID.
            </p>
            <p style={styles.paragraph}>
                Our desktop application also requires a password to access the data once you are authenticated through ASU. Please reach out to Dr. Bateman for this password to access the site.
            </p>

            <h3 id="logging-in">Logging In</h3>
            <p style={styles.paragraph}>
                The Desktop Field Day app is located at:{" "}
                <a
                    style={styles.link}
                    href="https://asu-field-day-webui.web.app/login"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Field Day Desktop
                </a>
            </p>
            <p style={styles.paragraph}>Sign in to this portal with your ASU-affiliated Google account.</p>

            <h2 id="application-features" style={styles.subHeader}>
                Application Features
            </h2>
            <h3 id="dashboard-overview">Dashboard Overview</h3>
            <p style={styles.paragraph}>
                Once authenticated, you'll see the main dashboard. Each tab represents a different category of critter data collected in the field.
            </p>
            <img
                src="src/assets/UserGuide/mainpage.png"
                alt="Dashboard Overview"
                style={styles.image}
            />
            <p style={styles.paragraph}>Currently, there are 7 different tabs:</p>
            <ol>
                <li>Turtle</li>
                <li>Lizard</li>
                <li>Mammal</li>
                <li>Snake</li>
                <li>Arthropod</li>
                <li>Amphibian</li>
                <li>Session</li>
            </ol>
            <p style={styles.paragraph}>
                Each tab is self-describing, as it contains the data for each critter species. The Session tab is for the entries created during the current session.
            </p>

            <h3 id="data-source-tab">Data Source Tab</h3>
            <p style={styles.paragraph}>
                One of the most important things to note is the Data Source Tab:
            </p>
            <img
                src="src/assets/UserGuide/datasource.png"
                alt="Data Source Tab"
                style={styles.image}
            />
            <p style={styles.paragraph}>
                This tab switches between which set of data to use. There are two selections:
            </p>
            <ul style={styles.list}>
                <li>
                    <b>Live:</b> The live database. This is the most up-to-date data being collected in the field. Be careful when editing this data!
                </li>
                <li>
                    <b>Test:</b> A test environment. These entries are mostly the development team testing out different features of the application to ensure they work.
                </li>
            </ul>

            <h3 id="managing-entries">Managing Entries</h3>
            <p style={styles.paragraph}>
                All entries are available to be viewed on the desktop application. To edit/delete/alter these entries, click the edit or delete button on the side of each entry under the "Actions" column.
            </p>
            <img
                src="src/assets/UserGuide/editcolumns_beforebutton.png"
                alt="Edit Button Example"
                style={styles.image}
            />
            <p style={styles.paragraph}>
                Clicking the edit button makes these fields editable. To save or discard these changes, hit the check or X button, respectively.
            </p>

            <h3 id="editing-table-view">Editing the Table View</h3>
            <p style={styles.paragraph}>
                If a certain page is too crowded, fields can be removed from the table using the editor in the top-right corner.
            </p>
            <img
                src="src/assets/UserGuide/columnselector.png"
                alt="Column Selector"
                style={styles.image}
            />

            <h3 id="searching-entries">Searching For Entries</h3>
            <p style={styles.paragraph}>
                Using the search bar, you can search for multiple terms to find the exact entry you need. For example: In the Lizard tab, say you wanted to find lizards of species code ASTI with toe-clip code C1. First, type ASTI into the search box. For any other term, add a +.
            </p>
            <img
                src="src/assets/UserGuide/searchtwoterms.png"
                alt="Search Example"
                style={styles.image}
            />

            <h2 id="data-handling" style={styles.subHeader}>
                Detailed Instructions for Data Handling
            </h2>
            <h3 id="exporting-reports">Exporting Reports</h3>
            <p style={styles.paragraph}>
                At the bottom of any page, you can find the Export button to generate CSV files for further processing.
            </p>
            <img
                src="src/assets/UserGuide/exportToCSV.png"
                alt="Export Button"
                style={styles.image}
            />

            <h3 id="what-is-a-session">What is a Session?</h3>
            <p style={styles.paragraph}>
                A session is a way to track and organize critical data about individual days collecting data out in the field.
            </p>

            <h3 id="merging-sessions">Merging Sessions</h3>
            <p style={styles.paragraph}>
                If entries are entered into the wrong session, there is an easy way to fix it using the Merge Sessions button.
            </p>
            <img
                src="src/assets/UserGuide/mergesession_button.png"
                alt="Merge Sessions Button"
                style={styles.image}
            />

            <h2 id="troubleshooting" style={styles.subHeader}>
                Troubleshooting
            </h2>
            <h3 id="common-issues">Common Issues</h3>
            <p style={styles.paragraph}>To be written. See note in FAQs.</p>

            <h3 id="faqs">FAQs</h3>
            <p style={styles.paragraph}>
                Ask Heather about how her team uses the app and any questions they ask on a day-to-day basis.
            </p>

            <h2 id="feedback" style={styles.subHeader}>
                Feedback
            </h2>
            <p style={styles.paragraph}>
                Please reach out to Dr. Bateman with any requests to make this app a better place for all of us!
            </p>
            <p style={{ textAlign: "center", marginTop: "50px", color: "#95a5a6" }}>
                Last Updated: 12/19/2025
            </p>
        </div>
    );
}
