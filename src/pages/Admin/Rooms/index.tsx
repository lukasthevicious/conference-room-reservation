import { useState, useEffect, FC } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useRoomsAdminFncs } from "../../../hooks/useRoomsAdminFncs";
import LoadingSpinner from "../../../components/ui/LoadingSpinner/LoadingSpinner";
import AddRoomModal from "./AddRoomModal";
import { Button } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import Room from "../../../components/admin/rooms/Room";
import { CompanyRoom } from "../../../types/types";

const RoomsList: FC = () => {
  const [rooms, setRooms] = useState([] as CompanyRoom[]);
  const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);

  const { roomsFetch, isLoading } = useRoomsAdminFncs();

  useEffect(() => {
    roomsFetch(setRooms);
  }, []);

  return (
    <div className="ml-2 h-content lg:w-screen flex  flex-col items-center ">
      {isLoading ? (
        <LoadingSpinner />
      ) : addRoomModalOpen ? (
        <AddRoomModal
          isOpen={addRoomModalOpen}
          setIsOpen={setAddRoomModalOpen}
          setRooms={setRooms}
          rooms={rooms}
        />
      ) : (
        <>
          <TableContainer className="mt-5">
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rooms.map((room: CompanyRoom) => {
                  return <Room key={room.id} room={room} setRooms={setRooms} />;
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <Button
            colorScheme="facebook"
            leftIcon={
              <AiOutlinePlusCircle size={25} style={{ color: "#f0fdf4" }} />
            }
            onClick={() => setAddRoomModalOpen(true)}
            className="mt-2"
          >
            Add room
          </Button>
        </>
      )}
    </div>
  );
};

export default RoomsList;
