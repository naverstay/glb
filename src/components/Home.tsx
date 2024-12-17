import React from "react";

type Props = {
    setPracticeMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Home({setPracticeMode}: Props) {
    // Set up practice mode

    console.log('###RENDER### home');

    return (
        <div className="container">
            <div className="home-cell">
                <span className="home-logo">
                    <img src={`${process.env.PUBLIC_URL}/images/logo-home.png`}/>
                </span>
                <button className="btn-home btn" onClick={() => setPracticeMode(false)}>
                    <img src={`${process.env.PUBLIC_URL}/images/daily-mode.png`}/>
                </button>
                <button className="btn-home btn" onClick={() => setPracticeMode(true)}>
                    <img src={`${process.env.PUBLIC_URL}/images/practice-mode.png`}/>
                </button>
            </div>
        </div>
    );
}
