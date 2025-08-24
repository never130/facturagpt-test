import CheckList from './CheckList';
import Data from './Data';
import DoClick from './DoClick';
import Drag from './Drag';
import FillText from './FillText';
import Html from './Html';
import Image from './Image';
import Link from './Link';
import Menu from './Menu';
import OnMouse from './OnMouse';
import Radio from './Radio';
import Reload from './Reload';
import Return from './Return';
import Screen from './Screen';
import Script from './Script';
import Scroll from './Scroll';
import Source from './Source';
import Table from './Table';
import Text from './Text';
import UploadFile from './UploadFile';
import ValidateElement from './ValidateElement';
import ValidateText from './ValidateText';
import WaitElement from './WaitElement';
import WaitLoad from './WaitLoad';
import WaitTime from './WaitTime';
import WebHook from './WebHook';
import Zoom from './Zoom';



const Meet = ({
    type = 'checklist',
    message,
    setMessages,
    conf = {},
}) => {

    return (
        <div className={styles.container}>
            {type === 'checklist' && <CheckList />}
            {type === 'data' && <Data />}
            {type === 'do-click' && <DoClick />}
            {type === 'drag' && <Drag />}
            {type === 'fill-text' && <FillText />}
            {type === 'html' && <Html />}
            {type === 'image' && <Image />}
            {type === 'link' && <Link />}
            {type === 'menu' && <Menu />}
            {type === 'on-mouse' && <OnMouse />}
            {type === 'radio' && <Radio />}
            {type === 'reload' && <Reload />}
            {type === 'return' && <Return />}
            {type === 'screen' && <Screen />}
            {type === 'script' && <Script />}
            {type === 'scroll' && <Scroll />}
            {type === 'source' && <Source />}
            {type === 'table' && <Table />}
            {type === 'text' && <Text />}
            {type === 'upload-file' && <UploadFile />}
            {type === 'validate-element' && <ValidateElement />}
            {type === 'validate-text' && <ValidateText />}
            {type === 'wait-element' && <WaitElement />}
            {type === 'wait-load' && <WaitLoad />}
            {type === 'wait-time' && <WaitTime />}
            {type === 'web-hook' && <WebHook />}
            {type === 'zoom' && <Zoom />}
        </div>
    )

}

export default Meet;