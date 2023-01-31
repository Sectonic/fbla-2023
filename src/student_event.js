import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import PopupMain from './popups/popup_main';

export default function StudentEvent({user, admin}) {
    const [past, setPast] = useState([]);
    const [avaliable, setAvaliable] = useState([]);
    const [enrolled, setEnrolled] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState([]);

    useEffect(() => {
        fetch(`/get/events?id=${user}&admin=${admin}`)
        .then(res => res.json())
        .then(data => {
            setPast(data.past_events);
            setAvaliable(data.avaliable_events);
            setEnrolled(data.enrolled);
        });
    }, []);

    const getDay = (startunix) => {
        let start = dayjs.unix(startunix);
        return (
            <>
                {start.format('dddd')}
            </>
        )
    }

    const getTimes = (startunix, endunix) => {
        let start = dayjs.unix(startunix);
        let end = dayjs.unix(endunix);
        return (
            <>
                {start.format('h:mm A')} to {end.format('h:mm A')}
            </>
        )
    };

    const removePopup = () => {
        setShowPopup(false);
    };

    const openPopup = (type) => {
        setShowPopup(true);
        setPopupType(type);
    };

    return (
        <div className="mt-6 pb-12">
            {showPopup && <PopupMain type={popupType} remove={removePopup}  />}
            <div className="divider px-5">Attended Events</div>
                {enrolled.length !== 0 ? (
                        <div className="flex flex-wrap justify-center px-5 gap-10 mt-10">
                            {enrolled.map(event => {
                                return (
                                    <div className="card w-80 h-max-content bg-base-100 shadow-xl">
                                        <div className="card-body">
                                            <h2 className="card-title">{event.name}
                                                <div className="badge badge-primary">{dayjs.unix(event.startTime).format('MM/DD/YYYY')}</div>
                                            </h2>
                                            <p>{event.description.substr(0, 64)}{event.description.length > 65 && '...'}</p>
                                            <div className="divider my-0"></div> 
                                            <p> Earned <span className='badge'>{event.points} points</span>
                                            </p>
                                            <div className="card-actions justify-end">
                                            { dayjs().unix() > event.startTime && dayjs().unix() < event.endTime &&
                                                <button className="btn btn-sm btn-success mt-2 pointer-events-none">Live</button>
                                            }
                                            <button
                                                onClick={() => openPopup(['event_view', event])}
                                                className="flex items-center justify-between btn btn-sm mt-2">
                                                <span>View</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
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
                                <span>You have not attended any events</span>
                            </div>
                        </div>
                    )} 
            <div className="divider px-5 mt-10">Avaliable Events</div> 
                {avaliable.length !== 0 ? (
                    <div className="flex flex-wrap justify-center px-5 gap-10 mt-10">
                        {avaliable.map(event => {
                            return (
                                <div className="card w-[400px] h-max-content bg-base-100 shadow-xl">
                                    <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure>
                                    <div className="card-body">
                                        <h2 className="card-title">{event.name}
                                            <div className="badge badge-secondary">{dayjs.unix(event.startTime).format('MM/DD/YYYY')}</div>
                                        </h2>
                                        <p>{event.description.substr(0, 80)}{event.description.length > 81 && '...'}
                                            <br/><div className="badge badge-outline mt-3">{getDay(event.startTime)}</div>
                                            <br/><div className="badge badge-outline mt-1">{getTimes(event.startTime, event.endTime)}</div> 
                                        </p>
                                        <div className="card-actions justify-end">
                                        { event.student_planned &&
                                            <button className="btn btn-sm btn-accent mt-2 pointer-events-none">Planned</button>
                                        }
                                        { dayjs().unix() > event.startTime && dayjs().unix() < event.endTime &&
                                            <button className="btn btn-sm btn-success mt-2 pointer-events-none">Live</button>
                                        }
                                        <button
                                            className="flex items-center justify-between btn btn-sm btn-primary mt-2"
                                            onClick={() => openPopup(['event_view', event])}
                                            >
                                            <span>Learn More</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </button>
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
                            <span>There are no avaliable events</span>
                        </div>
                    </div>
                )}
            <div className="divider px-5 mt-10">Past Events</div>
                {past.length !== 0 ? (
                        <div className="flex flex-wrap justify-center px-5 gap-10 mt-10">
                            {past.map(event => {
                                return (
                                    <div className="card w-60 h-max-content bg-base-100 shadow-xl">
                                        <div className="card-body p-4">
                                            <h2 className="card-title">{event.name}
                                                <div className="badge">{dayjs.unix(event.startTime).format('MM/DD/YYYY')}</div>
                                            </h2>
                                            <p>{event.description.substr(0, 50)}{event.description.length > 51 && '...'}</p>
                                            <div className="divider my-0"></div> 
                                            <div className="card-actions justify-end">
                                                <button
                                                    onClick={() => openPopup(['event_view', event])}
                                                    className="flex items-center justify-between btn btn-sm mt-2">
                                                    <span>View</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd"
                                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </button>
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
                                <span>There are currently no past events</span>
                            </div>
                        </div>
                    )}
        </div>
    )
}