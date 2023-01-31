import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
export default function Student({student_id}) {
    const [person, setPerson] = useState({});
    const [ifPerson, setIfPerson] = useState(false);

    useEffect(() => {
        fetch(`/get/student?id=${student_id}`)
        .then(res => res.json())
        .then(data => {
            setPerson(data.student);
            setIfPerson(true);
        });
    }, [])

    function getNumberWithOrdinal(n) {
        var s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    return (
        <div>
            <h3 className="text-2xl font-bold text-center">{ifPerson && `${person.firstName} ${person.lastName}'s Profile`}</h3>
            <div className='flex justify-center flex-col gap-5 mt-5'>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                        </div>
                        <div className="stat-title">Total Points</div>
                        <div className="stat-value text-primary">{ifPerson && person.points.total}</div>
                        <div className="stat-desc">All points earned in all quarters</div>
                    </div>
                    
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div className="stat-title">Quarter Points</div>
                        <div className="stat-value text-primary">{ifPerson && person.points.quarter}</div>
                        <div className="stat-desc">Points earned in the current quarter</div>
                    </div>
                </div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        </div>
                        <div className="stat-title">Events Attended</div>
                        <div className="stat-value">{ifPerson && person.events.total}</div>
                        <div className="stat-desc">All events attended</div>
                    </div>
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="stat-title">Student Ranking</div>
                        <div className="stat-value">{ifPerson && getNumberWithOrdinal(person.standing.student)}</div>
                        <div className="stat-desc font-bold">out of {ifPerson && person.standing.total}</div>
                    </div> 
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        </div>
                        <div className="stat-title">Prizes Earned</div>
                        <div className="stat-value">{ifPerson && person.prizes.total}</div>
                        <div className="stat-desc">All prizes earned</div>
                    </div>
                </div>
                <div className='text-center text-xl font-bold -my-2'>Prizes Won</div>
                {ifPerson && person.prizes.all.length > 0 ? (
                    <div className="overflow-x-auto w-full">
                        <table className="table w-full">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Quarter</th>
                            </tr>
                            </thead>
                            <tbody>
                            {person.prizes.all.map(prize => {
                                return (
                                    <tr>
                                        <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src="/tailwind-css-component-profile-2@56w.png" alt="Avatar Tailwind CSS Component" />
                                            </div>
                                            </div>
                                            <div>
                                            <div className="font-bold">{prize.name}</div>
                                            </div>
                                        </div>
                                        </td>
                                        <td>
                                        {prize.type}
                                        <br/>
                                        <span className="badge badge-ghost badge-sm">{prize.size}+ Pts</span>
                                        </td>
                                        <td>{prize.year.startingYear}-{prize.year.endingYear} Q{prize.year.quarter}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                ): (
                    <div className="alert shadow-sm w-[350px] mx-auto">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>No prizes have been earned</span>
                        </div>
                    </div>
                )}
                <div className='text-center text-xl font-bold -my-2'>Events Attended</div>
                {ifPerson && person.events.all.length > 0 ? (
                    <div className="overflow-x-auto w-full">
                        <table className="table table-zebra w-full">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Points</th>
                                <th>Quarter</th>
                            </tr>
                            </thead>
                            <tbody>
                            {person.events.all.map(event => {
                                return (
                                    <tr>
                                        <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src="/tailwind-css-component-profile-2@56w.png" alt="Avatar Tailwind CSS Component" />
                                            </div>
                                            </div>
                                            <div>
                                            <div className="font-bold">{event.name}</div>
                                            <span className="badge badge-sm">Social</span>
                                            </div>
                                        </div>
                                        </td>
                                        <td>
                                            <span className='badge badge-ghost badge-lg'>{event.points}</span>
                                        <br/>
                                        </td>
                                        <td>
                                            {event.year.startingYear}-{event.year.endingYear} Q{event.year.quarter}<br/>
                                            <span className='badge badge-sm'>{dayjs.unix(event.startTime).format('MM/DD/YYYY')}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                ): (
                    <div className="alert shadow-sm w-[350px] mx-auto">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>No events have been attended</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}