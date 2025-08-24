import { useState, useRef, useEffect } from "react";
import styles from "./CarouselSelector.module.css";
import { ReactComponent as IgualA } from "../../../../../assets/IgualA.svg";
import { ReactComponent as DistintoDe } from "../../../../../assets/DistintoDe.svg";
import { ReactComponent as MayorA } from "../../../../../assets/MayorA.svg";
import { ReactComponent as MenorA } from "../../../../../assets/MenorA.svg";
import { ReactComponent as MayorOIGualQue } from "../../../../../assets/MayorOIgualQue.svg";
import { ReactComponent as MenorOIGualQue } from "../../../../../assets/MenorOIgualQue.svg";
import { ReactComponent as Entre } from "../../../../../assets/Entre.svg";
import { ReactComponent as NoEntre } from "../../../../../assets/NoEntre.svg";
import { ReactComponent as In } from "../../../../../assets/En.svg";
import { ReactComponent as NoEn } from "../../../../../assets/NoEn.svg";
import { ReactComponent as Contiene } from "../../../../../assets/Contiene.svg";
import { ReactComponent as NoContiene } from "../../../../../assets/NoContiene.svg";
import { ReactComponent as ComienzaCon } from "../../../../../assets/EmpiezaCon.svg";
import { ReactComponent as TerminaCon } from "../../../../../assets/TerminaCon.svg";
import { ReactComponent as CoincideConRegex } from "../../../../../assets/CoincideConLaExpresionRegular.svg";
import { ReactComponent as Antes } from "../../../../../assets/Antes.svg";
import { ReactComponent as Despues } from "../../../../../assets/Despues.svg";
import { ReactComponent as EnFechaEspecifica } from "../../../../../assets/EnFechaEspecifica.svg";
import { ReactComponent as EntreFechas } from "../../../../../assets/EntreFechas.svg";
import { ReactComponent as DiaDeLaSemana } from "../../../../../assets/DiaDeLaSemana.svg";
import { ReactComponent as EsNulo } from "../../../../../assets/EsNulo.svg";
import { ReactComponent as NoEsNulo } from "../../../../../assets/NoEsNulo.svg";
import { useTranslation } from "react-i18next";


export default function CarouselSelector({
  itemsOptions,
  selectedOperator,
  setSelectedOperator,
  setShowCarousel,
}) {
  const [t] = useTranslation('AutomatesComponent')

  const operatorOptions = [
    { icon: IgualA, description: "Igual a", title: "=" },
    { icon: DistintoDe, description: t('differentFrom'), title: "!=" },
    { icon: MayorA, description: t('greaterThan'), title: ">" },
    { icon: MenorA, description: t('lessThan'), title: "<" },
    { icon: MayorOIGualQue, description: t('greaterThanOrEqual'), title: ">=" },
    { icon: MenorOIGualQue, description: t('lessThanOrEqual'), title: "<=" },
    { icon: Entre, description: t('between'), title: "between" },
    { icon: NoEntre, description: t('notBetween'), title: "not between" },
    { icon: In, description: t('in'), title: "in" },
    { icon: NoEn, description: t('notIn'), title: "not in" },
    { icon: Contiene, description: t('contain'), title: "contains" },
    { icon: NoContiene, description: t('notContains'), title: "not contains" },
    { icon: ComienzaCon, description: t('startsWith'), title: "starts with" },
    { icon: TerminaCon, description: t('endsWith'), title: "ends with" },
    { icon: CoincideConRegex, description: t('matchesReges'), title: "matches regex", },
    { icon: Antes, description: t('before'), title: "before" },
    { icon: Despues, description:t('after'), title: "after" },
    { icon: EnFechaEspecifica, description: t('onSpecificDate'), title: "on" },
    { icon: EntreFechas, description: t('betweenDates'), title: "between dates" },
    { icon: DiaDeLaSemana, description: t('dayOfTheWeek'), title: "day of week", },
    { icon: EsNulo, description: t('isNull'), title: "is null" },
    { icon: NoEsNulo, description: t('isNotNull'), title: "is not null" },
  ];
  const [selected, setSelected] = useState(
    selectedOperator ? [selectedOperator] : []
  );
  const [options, setOptions] = useState(itemsOptions || operatorOptions);
  const carouselRef = useRef(null);

  const handleSelect = (e, option) => {
    e.preventDefault();
    e.stopPropagation();

    setSelected([option]);
    setSelectedOperator(option);
  };

  useEffect(() => {
    if (selectedOperator && !selected.includes(selectedOperator)) {
      const selectedOperators = operatorOptions.filter((item) => {
        if (item.title !== selectedOperator) {
          return item.title;
        }
      });
      setSelected([selectedOperator]);
      setOptions([selectedOperator, ...selectedOperators]);
    }
  }, [selectedOperator]);

  useEffect(() => {
    if (
      selectedOperator &&
      JSON.stringify([selectedOperator]) !== JSON.stringify(selected)
    ) {
      const selectedOperators = operatorOptions.filter((item) => {
        if (item.title !== selectedOperator) {
          return item.title;
        }
      });
      setSelected([selectedOperator]);
      setOptions([selectedOperator, ...selectedOperators]);
    }
  }, [itemsOptions]);

  useEffect(() => {
    const handleWheelScroll = (event) => {
      if (carouselRef.current) {
        event.preventDefault();
        carouselRef.current.scrollLeft += event.deltaY > 0 ? 50 : -50;
      }
    };

    const currentRef = carouselRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheelScroll, {
        passive: false,
      });
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleWheelScroll);
      }
    };
  }, []);

  return (
    <div ref={carouselRef} className={styles.carouselContainer}>
      {options.map((Option, index) => (
        <div key={index} className={styles.optionContainer}>
          <button
            key={index}
            className={`${styles.optionButton} ${selected.includes(Option.title) ? styles.selected : ""}`}
            onClick={(e) => {
              setShowCarousel(false);
              handleSelect(e, Option);
            }}
          >
            {<Option.icon />}
          </button>
          <h3 className={styles.description}>{Option.description}</h3>
        </div>
      ))}
    </div>
  );
}
