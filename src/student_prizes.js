import { useState, useEffect } from 'react';

export default function StudentPrizes({ user, admin }) {
    const [past, setPast] = useState([]);
    const [current, setCurrent] = useState([]);
    const [earned, setEarned] = useState([]);

    useEffect(() => {
        fetch(`/get/prizes?id=${user}&admin=${admin}`)
        .then(res => res.json())
        .then(data => {
            setPast(data.past_prizes);
            setCurrent(data.current_prizes);
            setEarned(data.given_prizes);
        });
    }, []);

    return (
        <div className="min-h-screen mt-6">
            <div className="divider px-5">Earned Prizes</div> 
                {earned.length !== 0 ? (
                    <div className="flex flex-wrap justify-center px-5 gap-10 mt-10">
                        {earned.map(prize => {
                            return (
                                <div className="card w-64 h-max-content bg-base-100 shadow-xl">
                                    <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure>
                                    <div className="card-body p-3">
                                        <h2 className="card-title justify-center">{prize.name}
                                        </h2>
                                        <p className="flex justify-center">
                                            <div className="badge badge-outline">{prize.type}</div> 
                                        </p>
                                        <div className="card-actions justify-end">
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="alert shadow-lg w-[350px] mx-auto">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>You have not earned any prizes</span>
                        </div>
                    </div>
                )}
            <div className="divider px-5 mt-10">Current Quarter Prizes</div> 
                {current.length !== 0 ? (
                    <div className="flex flex-wrap justify-center px-5 gap-10 mt-10">
                        {current.map(prize => {
                            return (
                                <div className="card w-64 h-max-content bg-base-100 shadow-xl">
                                    <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure>
                                    <div className="card-body p-3">
                                        <h2 className="card-title justify-center">{prize.name}
                                        </h2>
                                        <p className="flex justify-center">
                                            <div className="badge badge-outline">{prize.type}</div> 
                                        </p>
                                        <div className="card-actions justify-end">
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="alert shadow-lg w-[350px] mx-auto">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>There are no current prizes</span>
                        </div>
                    </div>
                )}
            <div className="divider px-5 mt-10">Past Prizes</div>
                {past.length !== 0 ? (
                    <div className="flex flex-wrap justify-center px-5 gap-10 mt-10">
                        {past.map(prize => {
                            return (
                                <div className="card w-64 h-max-content bg-base-100 shadow-xl">
                                    <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure>
                                    <div className="card-body p-3">
                                        <h2 className="card-title justify-center">{prize.name}
                                        </h2>
                                        <p className="flex justify-center">
                                            <div className="badge badge-outline">{prize.type}</div> 
                                        </p>
                                        <div className="card-actions justify-end">
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="alert shadow-lg w-[350px] mx-auto">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>There are currently no past prizes</span>
                        </div>
                    </div>
                )}
        </div>
    )
}