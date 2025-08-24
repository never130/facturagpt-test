import React from 'react';

const MeetScraping = ({
    message,
    messageContainerRef
}) => {
    return (<div>
        {message.text} <br />
        {message.timestamp}
        {/* {JSON.stringify(message)} */}
    </div>);
};

export default MeetScraping;