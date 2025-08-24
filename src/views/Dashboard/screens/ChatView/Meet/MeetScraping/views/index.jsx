import React, { useState } from 'react';

import styles from './index.module.css';



import { ReactComponent as IconPlus } from './assets/icon-plus.svg'
import { ReactComponent as IconVariable } from './assets/icon-var.svg'
import { ReactComponent as IconOperator } from './assets/icon-operator.svg'
import { ReactComponent as IconValue } from './assets/icon-value.svg'
import { ReactComponent as IconBrackets } from './assets/icon-brackets.svg'
import { ReactComponent as IconAutomate } from './assets/icon-automate.svg'




import ActionsView from './actions'
import OperatorView from './operator'
import ValueView from './value'
import AutomateView from './automate'
import VariableView from './variable'


const ViewerContainer = ({
    path, 
    setPath = () => {},
    setFilteredScrapActions = () => {}
}) => {

    return (
        <div className={styles.section}>
            <div className={styles.buttons}>
                <div
                    className={styles.button}
                    onClick={() => alert(1)}
                >
                    <IconPlus />
                </div>
                <div
                    className={styles.button}
                    onClick={() => setPath('variable')}
                >
                    <IconVariable />
                    Variable
                </div>
                <div
                    className={styles.button}
                    onClick={() => setPath('action')}
                >
                    <IconOperator />
                    Operator
                </div>
                <div
                    className={styles.button}
                    onClick={() => setPath('value')}
                >
                    <IconValue />
                    Valor
                </div>
                <div
                    className={styles.button}
                    onClick={() => setPath('operator')}
                >
                    <IconBrackets />
                    Parantesis
                </div>
                <div
                    className={styles.button}
                    onClick={() => setPath('automate')}
                >
                    <IconAutomate />
                    Regla
                </div>
            </div>


            {path == 'action' ? (
                <ActionsView setFilteredScrapActions={setFilteredScrapActions} />
            ) : path == 'operator' ? (
                <OperatorView />
            ) : path == 'variable' ? (
                <VariableView />
            ) : path == 'automate' ? (
                <AutomateView />
            ) : path == 'value' ? (
                <ValueView />
            ) : null}

        </div >
    )
}

export default ViewerContainer;