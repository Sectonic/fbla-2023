import EventAdd from './event_add';
import EventEdit from './event_edit';
import EventView from './event_view';
import PrizeAdd from './prize_add';
import PrizeEdit from './prize_edit';
import Student from './student';

export default function PopupMain({type, remove}) {
    return (
        <div className={`modal modal-open ${type[0]}`}>
            <div className="max-w-3xl modal-box">
                <label className="btn btn-sm btn-circle absolute right-2 top-2" onClick={remove}>✕</label>
                {type[0] === "event_add" && <EventAdd/>}
                {type[0] === "event_edit" && <EventEdit event={type[1]} />}
                {type[0] === "prize_add" && <PrizeAdd/>}
                {type[0] === "prize_edit" && <PrizeEdit prize={type[1]}/>}
                {type[0] === "student" && <Student student_id={type[1]} />}
                {type[0] === "event_view" && <EventView event={type[1]} />}
            </div>
        </div>
    )
}