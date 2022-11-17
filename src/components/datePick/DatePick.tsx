import { useState, useContext, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ReservationContext from "../../state/ReservationContext";
import { useNavigate } from "react-router-dom";

const DatePick = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const reservationContext = useContext(ReservationContext);
  const { setPickedDate } = reservationContext;

  useEffect(() => {
    setPickedDate(null);
  }, []);

  const pickDateHandler = (date: Date) => {
    //State ke controllingu component value
    setDate(date);
    //Date to string bez mezer --> pro porovnání s datem z FIrebase v DailyOverview componentu
    const adjustedDate = date.toLocaleDateString().replace(/\s/g, "");
    setPickedDate(adjustedDate);
    navigate("/overview");
  };

  return (
    <div className="flex flex-col justify-center items-center w-auto mb-32 ">
      <h1 className="text-lg mb-4">
        Please pick a date to reserve or browse meetings.
      </h1>
      <div className="w-72 flex items-center justify-center">
        <Calendar onChange={pickDateHandler} value={date} />
      </div>
    </div>
  );
};

export default DatePick;