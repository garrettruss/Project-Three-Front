
import "./HikeInfo.css";

const HikeInfo = (props) => (
    <div>
         <ul>
            {
                props.user ?
                <>
                    <p>Hiking is the best!</p>
                </>
                :
                <p>Do you even hike?</p>
            }
        </ul>
    </div>
); 

export default HikeInfo;




