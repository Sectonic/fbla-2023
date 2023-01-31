import { useState } from 'react';

export default function PrizeAdd() {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const removeBtn = () => {
        setError(false);
    }

    const createPrize = async () => {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                admin_id: localStorage.getItem('user'),
                name: name,
                type: type,
            })
        }
        fetch('/create/prize', requestOptions)
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
            <h3 className="text-2xl font-bold text-center">Create New Prize</h3>
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
                        <span className="label-text">Prize Name</span>
                    </label>
                    <input type="text" placeholder="Enter Prize Name" onChange={(e) => setName(e.target.value)} className="input input-bordered w-full max-w-xs" />
                </div>
                <div className="form-control w-full max-w-xs mx-auto">
                    <label className="label">
                        <span className="label-text">Prize Type</span>
                    </label>
                    <select onChange={(e) => setType(e.target.value)} className="select select-bordered text-base font-normal" >
                        <option disabled selected>Pick Prize Type</option>
                        <option>Food Reward</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                </div>
            </div>
            <div className='flex justify-center mt-6'>
                <div className='btn w-1/2 btn-primary' onClick={createPrize}>Create</div>
            </div>
        </div>
    )
}