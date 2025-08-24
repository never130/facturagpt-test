import Button from '../../../../components/Button/Button';
import styles from './CardExplore.module.css';
import { ReactComponent as StarExplore } from "../../../../assets/starExplore.svg"
import { ReactComponent as ShieldExplore } from "../../../../assets/shieldExplore.svg"
import { ReactComponent as CirclesExplore } from "../../../../assets/circlesExplore.svg"
import { ReactComponent as ChatIconMarketplace } from "../../../../assets/chatIconMarketplace.svg"
import { ReactComponent as AutomateIconMarketplace } from "../../../../assets/automateIconMarketplace.svg"
import { ReactComponent as PadlockMarketplace } from "../../../../assets/padlockMarketplace.svg"
import { ReactComponent as StarMarketplace } from "../../../../assets/starMarketplace.svg"
import { ReactComponent as ImageDefaultMarketplace } from "../../../../assets/imageDefaultMarketplace.svg"
import { ReactComponent as ContactsIconMarketplace } from "../../../../assets/contactsIconMarketplace.svg"
import { ReactComponent as AssetsIconMarketplace } from "../../../../assets/assetsIconMarketplace.svg"
import { ReactComponent as DocsIconMarketplace } from "../../../../assets/docsIconMarketplace.svg"

import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { setShowModal } from '../../../../../../slices/userSlices';

export default function CardExplore({
  imageUrl,
  title,
  leftText,
  rightText,
  description,
  onLeftButtonClick,
  onRightButtonClick,
  buttonText,
  buttonType,
  review,
  shield,
  father,
  name,
  creator,
  data
}) {
  const [t] = useTranslation("ChatView");
  const dispatch = useDispatch();
  return (
    <div className={styles.card}  onClick={() => {
      dispatch(
        setShowModal({
          modal: "infoExploreCommunity",
          type: father == 'workspace' ? 'workspace' : 'agent',
          selectedOptionCommunity: data,
        })
      );
    }}>
      <div className={styles.row1}>
        <div className={styles.left}>
          {imageUrl ? (
            <img src={imageUrl} className={styles.avatar} />
          ) : (
            <div className={styles.avatar}>{father == 'workspace' && <ImageDefaultMarketplace />}</div>
          )}
          <div className={styles.texts}>
            <div className={styles.title}>{father == 'workspace' ? t('workspaceName') : name || t('agentName')}<StarExplore /></div>
            <div className={styles.subtitles}>
              <div className={styles.description}>{father == 'workspace' ? t('availableRoles') : t('description')}</div>

            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.firstLine}>
            <span>{creator?.nombre} <StarExplore width={10} height={10} /> {shield && <ShieldExplore width={11} height={11} />}</span>
            <span className={styles.rightSubtitle}>{t('aYearAgo')} <PadlockMarketplace width={10} height={10} /> </span>
          </div>
          <div className={styles.secondLine}>
            <button> 99 {father == 'workspace' ? <ContactsIconMarketplace width={11} height={11} /> : <ChatIconMarketplace width={11} height={11} />}  </button>
            <button> 99 {father == 'workspace' ? <AssetsIconMarketplace width={11} height={11} /> : <AutomateIconMarketplace width={11} height={11} />}  </button>
            {father == 'workspace' && <button> 99 <DocsIconMarketplace width={11} height={11} /> </button>}
          </div>
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.left}>
          <Button headerStyle={{ borderRadius: "40px", fontSize: "12px" }} action={() => console.log()}>
            {" "}
            {father == 'workspace' ? t('saveWorkspace') : t('saveBot')}
          </Button>
          {father != 'workspace' && <Button headerStyle={{ borderRadius: "40px", fontSize: "12px" }} action={() => console.log()}>
            {" "}
            {t('tryChat')}
          </Button>}
          <Button type='white' headerStyle={{
            borderRadius: "40px", zIndex: "1", fontWeight: "bold",
            fontSize: "12px"
          }}
            action={() => console.log()}
          >
            {" "}
            {father == 'workspace' ? t('buyWorkspace') : t('buyBot')} <input className={styles.inputInButton} type="text" placeholder={`${t('price')} ${t('price')}`} />
          </Button>
          <div className={styles.textContainer}>
            <span className={styles.colorGrey}>{t(`${t('usedBy')} 99 ${t('users')}`)}</span>
            <StarMarketplace />
            <span>{review || t('noRatings')}</span>
          </div>
        </div>
        <div className={styles.right}>
          {father != 'workspace' && <CirclesExplore />}
        </div>


      </div>
    </div>
  );
}
