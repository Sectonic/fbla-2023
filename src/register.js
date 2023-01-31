import {useState, useRef, useEffect} from 'react';
import {useLocation} from "react-router-dom";

function Register(props) {
    const location = useLocation();
    const [type, setType] = useState(true);
    const student = useRef(null);
    const admin = useRef(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [grade, setGrade] = useState(9);
    const [schoolName, setSchoolName] = useState('');
    const [schoolCode, setSchoolCode] = useState('');
    const [startingYear, setStartingYear] = useState(2022);
    const [endingYear, setEndingYear] = useState(2023);
    const [quarter, setQuarter] = useState(3);

    const changeType = () => {
        admin.current.className = `flex justify-center px-6 py-3 btn ${type ? '' : 'btn-outline'} btn-primary`;
        student.current.className = `flex justify-center px-6 py-3 btn ${type ? 'btn-outline' : ''} btn-primary`;
        setType(!type)
    }

    useEffect(() => {
        location.state && setError(true);
        setErrorMessage(location.state === 'account' ? 'An account is needed to access this page' : 'An Admin account is needed to access this page');
        location.state === 'admin' && changeType();
    }, [location.state]);

    const createStudent = async () => {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                grade: grade,
                schoolCode: schoolCode
            })
        }
        fetch('/register/student', requestOptions)
           .then(res => res.json())
           .then(data => {
                if (data["error"] === undefined) {
                    props.login(data);
                }
                else {
                    setError(true);
                    setErrorMessage(data["error"]);
                }
           });
    }

    const createAdmin = async () => {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                schoolName: schoolName,
                schoolCode: schoolCode,
                password: password,
                startingYear: startingYear,
                endingYear: endingYear,
                quarter: quarter
            })
        }
        fetch('/register/admin', requestOptions)
           .then(res => res.json())
           .then(data => {
                if (data["error"] === undefined) {
                    props.login(data);
                }
                else {
                    setError(true);
                    setErrorMessage(data["error"]);
                }
           });
    }

    const removeBtn = () => {
        setError(false);
    }

    return (
      <div>
           <section className="bg-base-100">
                <div className="flex justify-center min-h-screen">
                    <div className="hidden bg-cover lg:block lg:w-2/5" style={{
                        backgroundImage: "url('/img/register_bg.avif')"
                    }}>
                    </div>
                    <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                        <div className="w-full text-center md:text-left">
                            {error && <div className="alert alert-error shadow-lg mb-5">
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
                            <h1 className="text-3xl font-bold tracking-tight text-base-content capitalize">
                                Join This App Now.
                            </h1>
                            <p className="mt-4 text-neutral">
                                Let's get you started on joining or creating your school's events and price pools.
                            </p>
                            <div className="mt-6">
                                <h1 className="text-neutral">Select type of account</h1>
                                <div className="mt-3 flex max-md:justify-center items-center gap-5">
                                    <button className="flex justify-center px-6 py-3 btn btn-primary" onClick={changeType} ref={student}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="mx-2">
                                            Student
                                        </span>
                                    </button>
                                    <button className="flex justify-center px-6 py-3 btn btn-outline btn-primary" onClick={changeType} ref={admin}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="mx-2">
                                            Admin
                                        </span>
                                    </button>
                                </div>
                            </div>
                            { type ? (
                                <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">First Name</span>
                                        </label>
                                        <input onChange={(e) => setFirstName(e.target.value)}  type="text" placeholder="Type First Name" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">Last Name</span>
                                        </label>
                                        <input onChange={(e) => setLastName(e.target.value)}  type="text" placeholder="Type Last Name" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">Email Address</span>
                                        </label>
                                        <input onChange={(e) => setEmail(e.target.value)}  type="email" placeholder="Type Email" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input onChange={(e) => setPassword(e.target.value)}  type="password" placeholder="Type Password" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">Grade Level</span>
                                        </label>
                                        <select onChange={(e) => setGrade(e.target.value)} className="select select-bordered text-base font-normal" >
                                            <option disabled selected>Pick Grade level</option>
                                            <option>9</option>
                                            <option>10</option>
                                            <option>11</option>
                                            <option>12</option>
                                        </select>
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">School Code</span>
                                        </label>
                                        <input onChange={(e) => setSchoolCode(e.target.value)}  type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mt-5 mx-auto" mx-auto>
                                        <button
                                            onClick={createStudent}
                                            className="flex items-center justify-between btn btn-primary">
                                            <span>Sign Up </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">School Name</span>
                                        </label>
                                        <input onChange={(e) => setSchoolName(e.target.value)}  type="text" placeholder="Name of School" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">School Code</span>
                                        </label>
                                        <input onChange={(e) => setSchoolCode(e.target.value)}  type="text" placeholder="Join Code for Students" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">Email Address</span>
                                        </label>
                                        <input onChange={(e) => setEmail(e.target.value)}  type="email" placeholder="Type Email" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input onChange={(e) => setPassword(e.target.value)}  type="password" placeholder="Type Password" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">Starting Year</span>
                                        </label>
                                        <input onChange={(e) => setStartingYear(e.target.value)}  type="text" placeholder="Current Starting Year" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">Ending Year</span>
                                        </label>
                                        <input onChange={(e) => setEndingYear(e.target.value)}  type="text" placeholder="Current Ending Year" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs mx-auto">
                                        <label className="label">
                                            <span className="label-text">Quarter</span>
                                        </label>
                                        <select onChange={(e) => setQuarter(e.target.value)} className="select select-bordered text-base font-normal" >
                                            <option disabled selected>Pick Current Quarter</option>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                        </select>
                                    </div>
                                    <div className="form-control w-full max-w-xs mt-5 md:mt-9 mx-auto" mx-auto>
                                        <button
                                            onClick={createAdmin}
                                            className="flex items-center justify-between btn btn-primary">
                                            <span>Sign Up </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div> 
                            )
                            }
                            <p className="mt-8 md:mt-12 text-center text-sm text-gray-600">
                                Already Have an account?{' '}
                                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Login here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
      </div>
    );
  }
  
  export default Register;