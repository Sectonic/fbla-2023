import { useState, useEffect } from 'react';
import PopupMain from './popups/popup_main';

export default function AdminDashboard({admin_id}) {
    const [students, setStudents] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState([]);
    const [quarter, setQuarter] = useState(null);
    const [winners, setWinners] = useState(null);

    function getNumberWithOrdinal(n) {
        var s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    useEffect(() => {
        fetch(`/get/quarter?id=${admin_id}`)
        .then(res => res.json())
        .then(data => {
            setQuarter(data.quarter);
        });
        fetch(`/get/students?id=${admin_id}`)
        .then(res => res.json())
        .then(data => {
            setStudents(data.students);
        });
        fetch(`/get/winners?id=${admin_id}`)
        .then(res => res.json())
        .then(data => {
            setWinners(data);
        })
    }, []);

    const removePopup = () => {
        setShowPopup(false);
    };

    const openPopup = (type) => {
        setShowPopup(true);
        setPopupType(type);
    };

    const resetQuarter = () => {
        var all_winners = [];
        all_winners.push({
            prize: winners.top.prize.id,
            student: winners.top.student.id
        })
        Object.keys(winners.grades).forEach(key => {
            let value = winners['grades'][key];
            value.forEach(winner => {
                all_winners.push({
                    prize: winner.prize.id,
                    student: winner.student.id
                })
            })
        });
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                admin_id: admin_id,
                winners: all_winners
            })
        }
        fetch('/set/prizes', requestOptions)
        .then(res => res.json())
        .then(window.location.reload());
    }

    return (
        <div className="min-h-screen mt-6">
            {showPopup && <PopupMain type={popupType} remove={removePopup}  />}
            <input type="checkbox" id="my-modal-5" className="modal-toggle" />
            <div className="modal !z-40">
                <div className="modal-box max-w-3xl">
                    <label htmlFor="my-modal-5" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="font-bold text-lg text-center">Submit your {quarter !== null && `${quarter.startingYear}-${quarter.endingYear} Q${quarter.quarter}`} prize winners!</h3>
                    <p className="py-2 text-sm text-center">Because you are resetting the quarter, you need to give away all your prizes! Here are the winners. The prizes will go directly to their account after submitting.</p>
                    <div className='mt-3'>
                        <div className="rounded-lg flex justify-center gap-7 bg-base-100 shadow-lg px-5">
                            <figure><img src={winners ? "/img/top.png" : "/img/error.png"} alt="Movie" className={winners ? 'w-28':'w-20 p-2'} /></figure>
                            <div className="flex items-center">
                                {winners ? (
                                    <div>
                                        <h2 className="card-title text-lg font-bold">Top Earner: {winners.top.student.firstName} {winners.top.student.lastName}</h2>
                                        <p className='text-lg'><span className='badge badge-lg font-bold'>Prize: {winners.top.prize.name}</span> <span className='badge badge-lg'>{getNumberWithOrdinal(winners.top.student.grade)} Grade</span> <span className='badge badge-secondary badge-lg'>{winners.top.student.total}pts</span></p>
                                    </div>
                                ):(
                                    <div>
                                        <h2 className='card-title text-lg font-bold'>You have no prizes to give</h2>
                                        <p className='text-lg -mt-1'>Please have at least one prize before submitting</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {winners && Object.entries(winners.grades).map(([key, value]) => {
                            return (<>
                                {value.length > 0 && (
                                    <>
                                        <div className='divider font-bold text-xl'>{getNumberWithOrdinal(key)} Grade</div>
                                        {value.map(winner => {
                                            return (
                                                <div className='flex justify-center flex-wrap gap-5'>
                                                    <div className='rounded-lg shadow-md p-3 text-lg'>
                                                        <div className='font-bold'>{winner.student.firstName} {winner.student.lastName}</div>
                                                        <div><span className='badge badge-primary badge-lg'>{winner.student.total}pts</span></div>
                                                        <div><span className='badge badge-lg font-bold'>Prize: {winner.prize.name}</span></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                )}
                            </>)
                        })}
                    </div>
                    <div className='mt-10 flex justify-center'>
                        {winners ? (
                            <button className='btn btn-success' onClick={resetQuarter}>Submit</button>
                        ):(
                            <button className='btn btn-disabled -mt-4'>Submit</button>
                        )}
                    </div>
                </div>
            </div>
            <input type="checkbox" id="warning-modal" className="modal-toggle" />
            <div className="modal !z-30">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Are you sure you want to reset this quarter?</h3>
                <p className="py-4">Resetting a quarter means you clear every students points as well as make the current quarter's events and prizes fully inactive.</p>
                <div className="modal-action">
                    <label htmlFor="my-modal-5" className="btn btn-success">Reset</label>
                    <label htmlFor="warning-modal" className="btn">Nevermind</label>
                </div>
            </div>
            </div>
            <div className="overflow-x-auto w-full -mt-6">
                <div className='text-center mt-5 font-bold text-xl'>{quarter !== null && `${quarter.startingYear}-${quarter.endingYear} Q${quarter.quarter}`}</div>
                <div className="flex justify-center py-4">
                    <label htmlFor="warning-modal" className="btn btn-error">Reset Quarter</label>
                </div>
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Grade</th>
                        <th>Total Points</th>
                        <th>Current Quarter Points</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {students && students.map(student => {
                        return (
                            <tr>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div>
                                            <div className="font-bold">{student.firstName} {student.lastName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><div className="badge">{student.email}</div></td>
                                <td><div className="badge badge-secondary">{student.grade}</div></td>
                                <td>{student.points.total}</td>
                                <td>{student.points.quarter}</td>
                                <th>
                                    <button className="btn" onClick={() => openPopup(['student', student.id])}>View</button>
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