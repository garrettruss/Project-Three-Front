import React from 'react';
import "./HikeInfo.css";
;

const HikeInfo = (props) => (
    <div>
            {
                props.user ?
                <>
                   <div classname="userScreen">
                    
                    <hr></hr>
                   </div>
                </>
                :
                <div className='noUserScreen'>
                    Welcome to our Peak Bagger Log site. This site is dedicated for those who dream of peaks and want to remember what they have done! 
                </div>
            }
    </div>
); 

export default HikeInfo;




