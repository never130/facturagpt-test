import React from 'react';
import ActionButtons from './ActionButtons/ActionButtons';
import StatsHeader from './StatsHeader/StatsHeader';
import LeftPanel from './LeftPanel/LeftPanel';
import RightPanel from './RightPanel/RightPanel';
import styles from './index.module.css';

const NewDashboard = ({ statistics,

    incomeRef,
      documentsRef,
      contactsRef,
      assetsRef,
      teamRef,
      contenedorRef
 }) => {



    return (
        <div className={styles.container}>
            <StatsHeader statistics={statistics} />
            <div className={styles.mainGrid}>
                <LeftPanel incomeRef={incomeRef}
                contenedorRef={contenedorRef}
      documentsRef={documentsRef}
      contactsRef={contactsRef}
      assetsRef={assetsRef}
      teamRef={teamRef} />
                <RightPanel />
            </div>
        </div>
    );
};

export default NewDashboard;