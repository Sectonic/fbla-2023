import { useState } from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function EventAdd() {
    const [startTime, setStartTime] = useState(dayjs(`${dayjs().year()}-${dayjs().month()+1}-${dayjs().date()} ${dayjs().hour()}:${dayjs().minute()}`));
    const [endTime, setEndTime] = useState(dayjs(`${dayjs().year()}-${dayjs().month()+1}-${dayjs().date()} ${dayjs().hour()+1}:${dayjs().minute()}`));
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [points, setPoints] = useState(30);
    const [pincode, setPincode] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const removeBtn = () => {
        setError(false);
    }

    const createEvent = async () => {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                admin_id: localStorage.getItem('user'),
                name: name,
                type: type,
                points: points,
                pincode: pincode,
                description: description,
                startTime: startTime.unix(),
                endTime: endTime.unix()
            })
        }
        fetch('/create/event', requestOptions)
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
            <h3 className="text-2xl font-bold text-center">Create New Event</h3>
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
            <div className="grid grid-cols-2 mt-3">
                <div className="form-control w-full max-w-xs mx-auto">
                    <label className="label">
                        <span className="label-text">Event Name</span>
                    </label>
                    <input type="text" placeholder="Enter Event Name" onChange={(e) => setName(e.target.value)} className="input input-bordered w-full max-w-xs" />
                </div>
                <div className="form-control w-full max-w-xs mx-auto">
                    <label className="label">
                        <span className="label-text">Event Type</span>
                    </label>
                    <select onChange={(e) => setType(e.target.value)} className="select select-bordered text-base font-normal" >
                        <option disabled selected>Pick Event Type</option>
                        <option disabled>Sporting Events</option>
                        <option>Football</option>
                        <option>Basketball</option>
                        <option>Volleyball</option>
                        <option>Swim & Dive</option>
                        <option>Track & Field</option>
                        <option disabled>Non-Sporting Events</option>
                    </select>
                </div>
                <div className="form-control w-full max-w-xs mx-auto">
                    <label className="label">
                        <span className="label-text">Event Points</span>
                    </label>
                    <div className='-mt-2 text-center'>{points}pts</div>
                    <input type="range" min="0" max="100" value={points} className="range range-primary" onChange={(e) => setPoints(e.target.value)} />
                </div>
                <div className="form-control w-full max-w-xs mx-auto">
                    <label className="label">
                        <span className="label-text">Event Pincode</span>
                    </label>
                    <input type="text" placeholder="Enter Event Pincode" onChange={(e) => setPincode(e.target.value)} className="input input-bordered w-full max-w-xs" />
                </div>
            </div>
            <div className="form-control w-full max-w-2xl mx-auto">
                <label className="label">
                    <span className="label-text">Event Description</span>
                </label> 
                <textarea className="textarea textarea-bordered h-24" onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description Here"></textarea>
            </div>
            <div className='flex justify-center gap-10 mt-6'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        className="w-[44%] mx-auto"
                        renderInput={(props) => <TextField {...props} />}
                        label="Event Start Time"
                        value={startTime}
                        onChange={(newValue) => {
                            setStartTime(newValue);
                        }}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        className="w-[44%] mx-auto"
                        renderInput={(props) => <TextField {...props} />}
                        label="Event End Time"
                        value={endTime}
                        onChange={(newValue) => {
                            setEndTime(newValue);
                        }}
                    />
                </LocalizationProvider>
            </div>
            <div className='flex justify-center mt-6'>
                <div className='btn w-1/2 btn-primary' onClick={createEvent}>Create</div>
            </div>
        </div>
    )
}