import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { FiSearch } from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./config/firebase";
import ContactCard from "./components/ContactCard";
import AddAndUpdate from "./components/AddAndUpdate";
import useDisclouse from "./hooks/useDisclouse";
import { ToastContainer, toast } from 'react-toastify';
import NotFound from "./components/NotFound";


const App = () => {
  const [contacts, setContacts] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclouse();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const contactsRef = collection(db, "contacts");

        onSnapshot(contactsRef, (snapshot) => {
          const contactLists = snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });

          setContacts(contactLists);
          return contactLists
        });
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, []);



  const filterdContacts = (e) => {
    const value = e.target.value

    const contactsRef = collection(db, "contacts");

    onSnapshot(contactsRef, (snapshot) => {
      const contactLists = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      const filterdContacts = contactLists.filter((contact) =>contact.Name.toLowerCase().includes(value.toLowerCase()))

      setContacts(filterdContacts);
      return filterdContacts
    });
  }

  return (
    <>
      <div className="max-w-[370px] mx-auto px-4">
        <Navbar />

        <div className="flex ">
          <div className="flex relative flex-grow items-center">
            <FiSearch className="ml-1 text-3xl text-white absolute" />
            <input onChange={filterdContacts}
              type="text"
              className="flex-grow h-10 bg-transparent border border-white rounded-md text-white pl-9"
            />
          </div>

          <IoIosAddCircle
            onClick={onOpen}
            className="text-5xl cursor-pointer text-white gap-2"
          />
        </div>

        <div className="mt-4 gap-3 flex flex-col">
          {contacts.length <=0 ? <NotFound/> :  contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
      <AddAndUpdate onClose={onClose} isOpen={isOpen} />
      <ToastContainer position="bottom-center"/>
    </>
  );
};

export default App;
