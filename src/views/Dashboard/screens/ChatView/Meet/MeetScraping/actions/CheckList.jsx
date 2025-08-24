import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

import { ReactComponent as IconChecklist } from '../assets/icon-checklist.svg';

import styles from './index.module.css';

const ChecklistView = () => {
  return (
    <div className={styles.container}>
      <ActionHeader
        icon={<IconChecklist />}
        title={'CheckList'}
        subtitle={'Marcar o desmarcar una casilla'}
      />
      <Input
        title={'Nombre de la acción'}
        placeholder={'Marcar Casilla'}
      />
      <Input
        title={'Selector CSS'}
        placeholder={'input[type="checkbox"][name="accept"]'}
      />
      <Checklist
        title={'Estado deseado'}
        placeholder={'Marcado'}
      />
      <Input
        title={'Timeout (ms)'}
        value={10000}
      />

    </div>
  );
};

export default ChecklistView;