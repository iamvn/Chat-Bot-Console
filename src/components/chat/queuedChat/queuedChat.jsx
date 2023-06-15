import React from 'react';

const QueuedMessageUsers = (props) => {
    const {visitorList, loadMessageHistory} = props;
    return(<div>
        {
            visitorList && visitorList.map((val, index)=>{
                return (<button key={`${val?._id}_${index}`} style={{
                    background: 'white', color: 'black', padding: '10px', borderRadius: '5px',
                    width: '100%', textAlign: 'left', fontWeight: '700'
                }} onClick={(e) => {loadMessageHistory(e, val, val?.v.token)}}>
                    {val?.fname}
                </button>)
            })
        }
    </div>)
}

export default React.memo(QueuedMessageUsers);