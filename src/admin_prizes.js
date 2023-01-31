import { useState, useEffect } from 'react';
import PopupMain from './popups/popup_main';

export default function AdminPrizes({user, admin}) {
    const [prizes, setPrizes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState([]);

    useEffect(() => {
        fetch(`/get/prizes?id=${user}&admin=${admin}`)
        .then(res => res.json())
        .then(data => {
            setPrizes(data.prizes);
        });
    }, []);

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
                    <label htmlFor="modal" className="btn btn-success" onClick={() => openPopup(['prize_add', ''])}>Add New Prize</label>
                </div>
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Claimed By</th>
                        <th>Quarter</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {prizes && prizes.map(prize => {
                        return (
                            <tr>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div>
                                            <div className="font-bold">{prize.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><div className="badge">{prize.type}</div></td>
                                <td>
                                    {prize.claimed ? 
                                        (<>
                                            {prize.claimed.firstName} {prize.claimed.lastName}<br/>
                                            <div className="badge">{prize.claimed.email}</div>
                                        </>) : (
                                            <div>None</div>
                                        )
                                    }
                                </td>
                                <td>{prize.year.startingYear}-{prize.year.endingYear} Q{prize.year.quarter}</td>
                                <th>
                                    <button className="btn btn-ghost" onClick={() => openPopup(['prize_edit', prize])}>Edit</button>
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