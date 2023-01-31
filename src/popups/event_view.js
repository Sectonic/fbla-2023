import dayjs from "dayjs";
import { useState } from 'react';

 
export default function EventView({ event }) {
    const [pincode, setPincode] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const removeBtn = () => {
        setError(false);
    }

    const Plan = () => {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: localStorage.getItem('user'),
                event_id: event.id
            })
        }
        fetch('/plan', requestOptions)
        .then(res => res.json())
        .then(window.location.reload());
    }

    const Attend = () => {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: localStorage.getItem('user'),
                event_id: event.id,
                pincode: pincode
            })
        }
        fetch('/attend', requestOptions)
        .then(res => res.json())
        .then(data => {
            if ("error" in data) {
                setError(true);
                setErrorMessage(data["error"]);
            }
            else {
                window.location.reload();
            }
        });
    }

    return (
        <div>
            <h3 className="text-2xl font-bold text-center">Viewing {event.name}</h3>
            {error && <div className="alert alert-error shadow-lg mb-5 mt-5">
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                    <h3>{errorMessage}</h3>
                    </div>
                </div>
                <div className="flex-none">
                    <button className="btn btn-sm btn-square btn-outline" onClick={removeBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
            }
            <div className='flex justify-center flex-col gap-5 mt-5'>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                        </div>
                        <div className="stat-title">Event Type</div>
                        <div className="stat-value text-primary">{event.type}</div>
                        <div className="stat-desc">The kind of event you should expect</div>
                    </div>
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div className="stat-title">Points Given</div>
                        <div className="stat-value text-primary">{event.points}</div>
                        <div className="stat-desc">Points earned from attending this event</div>
                    </div>
                </div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        </div>
                        <div className="stat-title">Number Planned</div>
                        <div className="stat-value">{event.planned_num}</div>
                        <div className="stat-desc">People planned to go</div>
                    </div>
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        </div>
                        <div className="stat-title">Number Attended</div>
                        <div className="stat-value">{event.attended_num}</div>
                        <div className="stat-desc">People who have attended</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="font-bold text-center text-md mb-2">{ dayjs().unix() < event.startTime ? 'Planning to Attend' : 'People Attended'}</div>
                        <div className="w-full h-80 overflow-y-scroll">
                            <table className="table table-zebra w-full">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Grade</th>
                                </tr>
                                </thead>
                                { dayjs().unix() < event.startTime ? (
                                    <tbody>
                                    {event.planned.map(student => {
                                        return (
                                            <tr>
                                                <td>
                                                    <div className="font-bold">{student.name}</div>
                                                </td>
                                                <td>
                                                    <span className="badge">{student.grade}</span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                    ) : (
                                    <tbody>
                                    {event.attended.map(student => {
                                        return (
                                            <tr>
                                                <td>
                                                    <div className="font-bold">{student.name}</div>
                                                </td>
                                                <td>
                                                    <span className="badge">{student.grade}</span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                    )
                                }
                            </table>
                        </div>
                    </div>
                    <div>
                        <div className="shadow rounded-xl py-4 mt-1 overflow-y-scroll">
                            <div className="text-center mb-1 font-bold text-md">Description</div>
                            <div className="text-center w-5/6 mx-auto max-h-[120px]">{event.description}</div>
                        </div>
                        {
                            event.student_attended ? (
                                <>
                                    <div className="mt-4 text-center text-sm opacity-70">
                                        You have already enrolled for this event
                                    </div>
                                    <div className="flex justify-center mt-2">
                                    <button className="btn btn-disabled">Already Enrolled</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {dayjs().unix() > event.endTime ? (
                                        <>
                                            <div className="mt-4 text-center text-sm opacity-70">
                                                This event has ended 
                                            </div>
                                            <div className="flex justify-center mt-2">
                                                <button className="btn btn-disabled">Past Event</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {dayjs().unix() < event.startTime ? (
                                                <>
                                                    <div className="mt-4 text-center text-sm opacity-70">
                                                        This event has not started yet
                                                    </div>
                                                    <div className="flex justify-center mt-2">
                                                        {event.student_planned ? (
                                                            <button className="btn btn-disabled">Already Planned</button>
                                                        ) : (
                                                            <button className="btn" onClick={Plan}>Plan to Attend</button>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="mt-4 text-center text-sm">
                                                        This event is <span className="badge badge-success">LIVE</span>
                                                    </div>
                                                    <div className="flex justify-center mt-4">
                                                        <div className="form-control">
                                                            <div className="input-group">
                                                                <input type="text" placeholder="Enter Pincode" onChange={(e) => setPincode(e.target.value)} className="input input-bordered" />
                                                                <button className="btn btn-primary" onClick={Attend}>
                                                                    Attend
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )
                        }
                        <div className="text-center mt-4 text-lg">
                            {dayjs.unix(event.startTime).format('MM/DD/YYYY')}
                        </div>
                        <div className="text-center mt-1">
                            <span className="badge badge-lg badge-ghost">{dayjs.unix(event.startTime).format('h:mm A')}</span> - <span className="badge badge-lg badge-ghost">{dayjs.unix(event.endTime).format('h:mm A')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}