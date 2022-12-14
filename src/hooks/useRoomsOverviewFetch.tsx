import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { roomData } from "../data/data";
import {
  BlocksBreakdown,
  CompanyRoom,
  Meeting,
  RoomData,
  Room,
} from "../types/types";
import { useState, useContext } from "react";
import ReservationContext from "../state/ReservationContext";

export const useRoomsOverviewFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setRoomsData } = useContext(ReservationContext);

  const roomsOverviewFetch = async (
    company: string,
    date: string
  ): Promise<void> => {
    setIsLoading(true);
    const querySnapshot = await getDocs(
      collection(db, `companies/${company}/rooms`)
    );
    //Stáhnou se data z Firebase, projedou se meetingy, a pokud jsou nějaké plánované meetingy ve vybraném dnu, tak se uloží do proměnné níže - za všechny místnosti.
    let todaysMeetings: Meeting[] = [];
    //Pomocná proměnná - Rozpad bloků + id místnosti
    let blocksBreakdown: BlocksBreakdown[] = [];
    //Rooms dané firmy (id a jméno. Pak posláno do state v mother componentu)
    let companyRooms: CompanyRoom[] = [];

    //Vytvořím proměnné s meetingy v daném dnu + jejich breakdown pro lepší pracování s daty.
    querySnapshot.forEach((doc) => {
      companyRooms.push({ id: doc.data().id, name: doc.data().name });

      if (!doc.data().meetings) return /* null */;

      const filteredMeetings = doc
        .data()
        .meetings.filter((meeting: Meeting) => {
          return meeting.date == date;
        });
      if (!filteredMeetings) return;

      filteredMeetings.forEach((meeting: Meeting) => {
        todaysMeetings.push(meeting);
        meeting.blocks.forEach((block: number) => {
          blocksBreakdown.push({ room: meeting.room, block });
        });
      });
    });

    //Rezervované bloky -> Najdu v každé room bloky, u kterých bude potřeba upravit property reserved na TRUE (podle rezervovaných meetingů v daném dnu) a upravím array
    const updatedRooms: Room[] = companyRooms.map((room: CompanyRoom) => {
      //Vyfiltrované dnešní meetingy podle dané room
      const filteredTodaysMeetings = todaysMeetings.filter(
        (meeting: Meeting) => {
          return meeting.room == room.id;
        }
      );
      //Helper proměnná
      const blocks = blocksBreakdown.map((bd: BlocksBreakdown) => {
        if (bd.room == room.id) return bd.block;
      });

      //Úprava roomData array, které půjde ke každé room (obsahuje blocky, časy, reserved a selected booleans)
      const newDataArray = roomData.map((oneRoom: RoomData) => {
        //Pomocné array - v případě, že daný block má rezervovaný meeting, tak v této proměnné budou čísla všech bloků, kterých se rezervovaný meeting týká, např. [2,3,4]
        let meetingsBlocksArray: number[] = [];

        filteredTodaysMeetings.forEach((meeting: Meeting) => {
          if (meeting.blocks.includes(oneRoom.block)) {
            meeting.blocks.forEach((block: number) =>
              meetingsBlocksArray.push(block)
            );
          }
        });
        return {
          ...oneRoom,
          reserved: blocks.includes(oneRoom.block),
          meetingBlocks: meetingsBlocksArray,
        };
      });
      return {
        ...room,
        roomData: newDataArray,
      };
    });
    setRoomsData(updatedRooms);
    setIsLoading(false);
  };

  return {
    isLoading,
    roomsOverviewFetch,
  };
};
