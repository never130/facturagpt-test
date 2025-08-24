import React, { useRef, useState } from 'react';
import styles from './HelpCategory.module.css';
import { ReactComponent as Rocket } from "../../../assets/Rocket.svg";
import { ReactComponent as Account } from "../../../assets/account.svg";
import { ReactComponent as Bd } from "../../../assets/bd.svg";
import { ReactComponent as Workflows } from "../../../assets/code-pull-req.svg";
import { ReactComponent as Agent } from "../../../assets/Frame.svg";
import { ReactComponent as ClipPath } from "../../../assets/Clippathgroup.svg";
import { ReactComponent as ButtonIcon } from "../../../assets/buttonicon.svg";
import { ReactComponent as Vector } from "../../../assets/Vector.svg";
import { ReactComponent as Security } from "../../../assets/Security.svg";
import { ReactComponent as Star } from "../../../assets/star-alt.svg";
import SearchIconWithIcon from '../../../components/SearchIconWithIcon/SearchIconWithIcon';
import lIcon from "../../../assets/lIcon.svg";
import { useTranslation } from 'react-i18next';
import Category from './Category';
import useFocusShortcut from '../../../../../utils/useFocusShortcut';

export default function HelpCategory({ category, updateCategory }) {
  const { t } = useTranslation("helpPage");
  const [searchTerm, setSearchTerm] = useState('')


  const categories = [
    {
      id: "firstSteeps",
      name: t('firstSteeps'),
      icon: <Rocket />,
      subcategories: [
        t('whatIsFacturaGPT'),
        t('createAccountAndActivateFirstToken'),
        t('tourWorkspace'),
        t('activeYourFirstIAgent'),
        t('CreateFirstDocument'),
        t('automatizeWorkflow'),
        t('useCasesBusiness'),
        t('GlosarioBasic'),
        t('shortcuts'),
        t('nowwhat'),
      ]
    }, {
      id: "yourAccount",
      name: t('yourAccount'),
      icon: <Account />,
      subcategories: [
        t('generalSettings'),
        t('profileSettings'),
        t('device'),
        t('speech'),
        t('actualPlan'),
        t('Workspace'),
        t('teamRolsAndAccess'),
        t('invite'),
        t('DataControls'),
        t('apps'),
        t('controlPanel'),
        t('nowwhat'),
      ]
    }, {
      id: "tables",
      name: t('tables'),
      icon: <Bd />,
      subcategories: [
        t('whatIsFacturaGPT'),
        t('createAccountAndActivateFirstToken'),
        t('tourWorkspace'),
      ]
    }, {
      id: "workflows",
      name: t('workflows'),
      icon: <Workflows />,
      subcategories: [
        t('whatIsFacturaGPT'),
        t('createAccountAndActivateFirstToken'),
        t('tourWorkspace'),
      ]
    }, {
      id: "agents",
      name: t('agents'),
      icon: <Agent />,
      subcategories: [
        t('whatIsFacturaGPT'),
        t('createAccountAndActivateFirstToken'),
        t('tourWorkspace'),
      ]
    }, {
      id: "docs",
      name: t('docs'),
      icon: <ClipPath />,
      subcategories: [
        t('whatIsFacturaGPT'),
        t('createAccountAndActivateFirstToken'),
        t('tourWorkspace'),
      ]
    }, {
      id: "activity",
      name: t('activity'),
      icon: <ButtonIcon />,
      subcategories: [
        t('whatIsFacturaGPT'),
        t('createAccountAndActivateFirstToken'),
        t('tourWorkspace'),
      ]
    }, {
      id: "comunity",
      name: t('comunity'),
      icon: <Vector />,
      subcategories: [
        t('whatIsFacturaGPT'),
        t('createAccountAndActivateFirstToken'),
        t('tourWorkspace'),
      ]
    }, {
      id: "security",
      name: t('security'),
      icon: <Security />,
      subcategories: [
        t('whatIsFacturaGPT'),
        t('createAccountAndActivateFirstToken'),
        t('tourWorkspace'),
      ]
    }, {
      id: "subscription",
      name: t('suscription'),
      icon: <Star />,
      subcategories: [
        t('whatIsFacturaGPT'),
        t('createAccountAndActivateFirstToken'),
        t('tourWorkspace'),
      ]
    }
  ]
  const handleCategory = (selected) => {
    updateCategory(selected);
  };
  const searchInputRef = useRef(null);

  useFocusShortcut(searchInputRef, "/");



  return (
    <div className={styles.helpCategoryContainer}>
      <SearchIconWithIcon
        ref={searchInputRef}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}

        classNameIconRight={styles.searchContainerL}
      >
        <img
          src={lIcon}
          alt="filterIcon"
          className={styles.searchContainerIcon}
        />
      </SearchIconWithIcon>

      {categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map((cat) => (

        <Category
          id={cat.id}
          category={cat.name}
          icon={cat.icon}
          subcategories={cat.subcategories}
          selectedCategory={category}
          updateCategory={handleCategory}

        />
      ))}
    </div>
  );
}