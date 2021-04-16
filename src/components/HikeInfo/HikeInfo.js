import React from 'react';
import "./HikeInfo.css";
;

const HikeInfo = (props) => (
    <div>
            {
                props.user ?
                <>
                   <div classname="userScreen">
                    
                   </div>
                </>
                :
                <div >
                    <div className='noUserScreen'> Welcome to our Peak Bagger Log site. This site is dedicated for those who dream of peaks.  </div> 
                    <p className='quote'> “Somewhere between the bottom of the climb and the summit is the answer to the mystery why we climb.” - Greg Child</p>
                </div>
            }
    </div>
); 

export default HikeInfo;

