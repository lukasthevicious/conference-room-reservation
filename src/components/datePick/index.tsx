import { useState } from "react";
import DatePick from "./DatePick";
import { IconButton } from "@chakra-ui/react";
import { AiOutlineArrowDown } from "react-icons/ai";

const Overview = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="flex justify-center items-center h-content bg-gradient-to-r from-violet-100 to-violet-200 ">
      {showCalendar ? (
        <DatePick />
      ) : (
        <div className="flex flex-col justify-center items-center mb-32 w-80 lg:w-full">
          <div className="text-xl lg:text-3xl mb-10 font-solid">
            <h1 className=" text-center mb-3">Welcome to Room Reserver</h1>
            <h2 className=" text-center">
              Continue by opening the calendar by button below
            </h2>
          </div>
          <IconButton
            colorScheme="purple"
            aria-label="arrow"
            icon={<AiOutlineArrowDown size={30} style={{ color: "white" }} />}
            onClick={() => setShowCalendar(true)}
            className="animate-bounce w-52"
            size="lg"
          />
        </div>
      )}
    </div>
  );
};

export default Overview;
