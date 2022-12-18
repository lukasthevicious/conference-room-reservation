import React, { useState, useContext, Dispatch, SetStateAction } from "react";
import { userRights, USER } from "../../../data/constants";
import { useUsersAdminFncs } from "../../../hooks/useUsersAdminFncs";
import useAuth from "../../../hooks/useAuth";
import { UserType } from "../../../types/types";
import AddUserForm from "../../../components/admin/users/AddUserForm";

type AddUserModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setUsers: Dispatch<SetStateAction<UserType[]>>;
};

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  setIsOpen,
  setUsers,
}) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    company: user!.company,
    rights: USER,
    creationDate: new Date().toLocaleString(),
  });

  const { addUser, fetchUsers, isLoading } = useUsersAdminFncs();

  const addUserHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    addUser(formData, setUsers)
      .then(() => fetchUsers(setUsers))
      .then(() => setIsOpen(false));
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  const inputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AddUserForm
      isOpen={isOpen}
      isLoading={isLoading}
      onClose={() => setIsOpen(false)}
      onChange={inputChangeHandler}
      formData={formData}
      options={userRights}
      addUserHandler={addUserHandler}
      onCancel={onCancel}
    />
  );
};

export default AddUserModal;
