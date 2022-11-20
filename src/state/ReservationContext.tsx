import { Room } from "../types/types";
import { getLocalStorage } from "../utils/getLocalStorage";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

interface ReservationContextInterface {
  pickedRoom: Room;
  setPickedRoom: Dispatch<SetStateAction<Room>>;
  pickedDate: string | null;
  setPickedDate: Dispatch<SetStateAction<string | null>>;
}

const ReservationContext = createContext({} as ReservationContextInterface);

export const ReservationContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  //Home (Calendar)
  const [pickedDate, setPickedDate] = useState<string | null>(
    getLocalStorage("date") || null
  );

  //Vybraná místnost - komplet data o rezervacích
  const [pickedRoom, setPickedRoom] = useState(
    getLocalStorage("pickedRoom") || ({} as Room)
  );

  useEffect(() => {
    localStorage.setItem("date", JSON.stringify(pickedDate));
  }, [pickedDate]);

  useEffect(() => {
    localStorage.setItem("pickedRoom", JSON.stringify(pickedRoom));
  }, [pickedRoom]);

  return (
    <ReservationContext.Provider
      value={{
        pickedDate,
        setPickedDate,
        pickedRoom,
        setPickedRoom,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
export default ReservationContext;
