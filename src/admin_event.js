import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import PopupMain from './popups/popup_main';

export default function AdminEvent({user, admin}) {
    const [events, setEvents] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState([]);

    useEffect(() => {
        fetch(`/get/events?id=${user}&admin=${admin}`)
        .then(res => res.json())
        .then(data => {
            setEvents(data.events);
        });
    }, []);

    const GetDate = ({startunix, endunix}) => {
        let start = dayjs.unix(startunix);
        let end = dayjs.unix(endunix);
        return (
            <>
                <td>
                    {start.format('MM/DD/YYYY')}
                    <br/>
                    <span className="badge">{start.format('dddd')}</span>
                </td>
                <td>{start.format('h:mm A')} - {end.format('h:mm A')}</td>
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
        <div className="min-h-screen mt-6">
            {showPopup && <PopupMain type={popupType} remove={removePopup}  />}
            <div className="overflow-x-auto w-full -mt-6">
                <div className="flex justify-center py-4">
                    <label htmlFor="modal" className="btn btn-success" onClick={() => openPopup(['event_add', ''])}>Add New Event</label>
                </div>
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Points</th>
                        <th>Pincode</th>
                        <th>Quarter</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {events && events.map(event => {
                        return (
                            <tr>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className="avatar">
                                        </div>
                                        <div>
                                        <div className="font-bold">{event.name}</div>
                                        <div className="badge">{event.type}</div>
                                        </div>
                                    </div>
                                </td>
                                <GetDate startunix={event.startTime} endunix={event.endTime} />
                                <td><div className="badge badge-secondary">{event.points}</div></td>
                                <td>{event.pincode}</td>
                                <td>{event.year.startingYear}-{event.year.endingYear} Q{event.year.quarter}</td>
                                <th>
                                    <label htmlFor="modal" className="btn btn-ghost" onClick={() => openPopup(['event_edit', event])}>Edit</label>
                                </th>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}