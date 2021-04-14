import React from 'react';
import Slider from 'infinite-react-carousel';

const SimpleSlider = () => (
    
    <div className="slider">
         <h1>Fast Facts</h1>
        <Slider dots>
           
               <div>
                <h3>Hiking is Healthy!</h3>
                </div>
                <div>
                <h3>Hiking is Rewarding!</h3>
                </div>
                <div>
                <h3>Hiking is Fun!</h3>
                </div>
                <div>
                <h3>Hiking is a Solo Sport!</h3>
                </div>
                <div>
                <h3>Hiking is a group Sport!</h3>
                </div>
        
         
        </Slider>
    </div>
);

export default SimpleSlider;