import { timeBlocks } from "../../common/dummyData";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ReservationContext from "../../state/ReservationContext";
import AuthContext from "../../state/AuthContext";

import { roomsMeetingsFetch } from "./roomsMeetingsFetch";

const Overview = () => {
  const [roomsData, setRoomsData] = useState<any>([]);
  const navigate = useNavigate();
  const [companyRooms, setCompanyRooms] = useState<any>([]);

  const reservationContext = useContext(ReservationContext);
  const authContext = useContext(AuthContext);

  const { setPickedBlock, pickedDate, /* setPickedDate, */ setPickedRoom } =
    reservationContext;

  const { user, company } = authContext;

  /*  const { isLoading, setIsLoading } = appContext; */

  //1. Firebase query - stáhne všechny rooms za danou firmu včetně meetingů a zpracované meetingy vč. upravených objektů o meetingy ve vybraném dnu uloží do state. Viz. funkce..
  useEffect(() => {
    console.log("jedu");
    roomsMeetingsFetch(
      "secondCompany", //upravit na company
      pickedDate,
      setCompanyRooms,
      setRoomsData
    );
    console.log(roomsData);
  }, []);

  const onClickBlockHandler = (room: number, block: number): void => {
    console.log(roomsData);
    //Uloží do Contextu room a block, na které user clicknul, aby se dalo pak použít v detailní rezervaci jako přednastaveno
    setPickedBlock({ room, block });
    const clickedRoom = roomsData.find((roomData: any) => {
      return roomData.id == room;
    });
    //přidána property selected: false ke každému bloku. U reserve se tam bude přidělovat kliknutí a podle toho se barvit.
    const adjustedRoomData = clickedRoom.roomData.map((data: any) => {
      return { ...data, selected: false };
    });
    const adjustedClickedRoom = { ...clickedRoom, roomData: adjustedRoomData };

    setPickedRoom(adjustedClickedRoom);
    navigate("/reserve");
  };

  const timeBlocksDom = timeBlocks.map((block) => {
    return (
      <div
        key={block.id}
        className=" flex justify-center items-center text-xs w-20 h-10  border border-yellow-700 rounded-md bg-gray-200 shadow-lg shadow-slate-600"
      >
        {block.time}
      </div>
    );
  });

  //Vypočítá šířku celého obsahu podle počtu místnosti - = 5rem) na místnost + 5rem za time blocks.
  const roomsNumber = roomsData.length;
  const displayWidth = roomsNumber * 5 + 5;

  //Počet sloupců pro GRID
  const displayCols = roomsNumber + 1;

  //Vytvoří DOM pro místnosti uzpůsobený pro Grid
  const roomsDom = roomsData.map((room: any) => {
    let meetingsHelper: number[] = [];
    let height;
    return (
      <div key={room.id} className="">
        <h1>{room.name}</h1>
        {room.roomData.map((roomData: any) => {
          const includedInHelper = meetingsHelper.some((no: number) =>
            roomData.meetingBlocks.includes(no)
          );
          if (includedInHelper) {
            return "";
          }
          if (roomData.reserved && !includedInHelper) {
            height = roomData.meetingBlocks.length * 2.5;

            //Přičte block do meetingHelper, aby se vědělo, že pro tento meeting byl již DOM vytvořen
            roomData.meetingBlocks.forEach((block: number) => {
              meetingsHelper.push(block);
            });

            return (
              <div
                key={roomData.block}
                onClick={() => onClickBlockHandler(room.id, roomData.block)}
                className={`  bg-blue-700 rounded-md flex justify-center items-center w-20 text-xs border border-green-600 cursor-pointer hover:scale-105 shadow-lg shadow-slate-600`}
                style={{ height: `${height}rem` }}
              >
                Reserved
              </div>
            );
          }
          return (
            <div
              key={roomData.block}
              onClick={() => onClickBlockHandler(room.id, roomData.block)}
              className={`h-10 rounded-md bg-white flex justify-center items-center w-20 text-xs border border-green-600 cursor-pointer hover:scale-105 shadow-lg shadow-slate-600`}
            >
              Free
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className="flex justify-center bg-gradient-to-r from-violet-300 to-violet-400 ">
      <section
        className="grid gap-5"
        //Custom in-line style, protože Tailwind neumožňuje dynamic styling - takto udělá grid podle počtu místností (const displayCols) a přidá dynamicky width contentu.
        style={{
          gridTemplateColumns: `repeat(${displayCols}, minmax(0, 1fr))`,
          width: `${displayWidth}rem`,
        }}
      >
        <div className=" -mt-0.5 ">
          {" "}
          <h1>Time</h1>
          {timeBlocksDom}
        </div>
        {roomsDom}
      </section>
    </div>
  );
};

export default Overview;
