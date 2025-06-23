import react from 'react';

const Pav = ( {emotion} ) => {

    return (
        <>
            {(emotion == "Happy") ? <img src="new2.png" style={{width: "100%"}} /> : <img src="PavSad.png" style={{width: "100%"}}/>}
        </>
    )
}

export default Pav;