import { useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import { dateToParams, dateFormatter } from "../../utils/dateParamsFormat";
import Calendar from "../../components/datePick/Calendar";

const DatePick: FC = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const pickDateHandler = (date: Date): void => {
    //State ke controllingu component value
    setDate(date);
    //Date to string bez mezer --> pro porovnání s datem z FIrebase v DailyOverview componentu
    const adjustedDate = dateFormatter(date);

    const dateParams = dateToParams(adjustedDate);

    /* navigate(`/date/${dateParams}/overview`); */
    /*  navigate(`/overview?date=${dateParams}`); */
    navigate({ pathname: `/overview`, search: `?date=${dateParams}` });
  };

  return (
    <div className="flex flex-col justify-center items-center w-auto mb-32 ">
      <h1 className="text-xl lg:text-2xl mb-4 font-solid text-center">
        Please pick a date to reserve or browse meetings.
      </h1>
      <Calendar onChange={pickDateHandler} value={date} />
    </div>
  );
};

export default DatePick;
