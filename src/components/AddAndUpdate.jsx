import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import Modal from "./Modal"
import {ErrorMessage, Field, Form, Formik} from "formik"
import { db } from "../config/firebase"
import { toast } from "react-toastify"
import * as Yup from "yup" 

const contactSchemaValidation = Yup.object().shape({
    Name : Yup.string().required("Name is Required"),
    email : Yup.string().email("Invalid Email").required("Email is Required"),
})

 
const AddAndUpdate = ({isOpen , onClose , isUpdate , contact}) => {

    const addContact =async (contact)=> {
        try {
            const contactRef = collection(db , "contacts")
            await addDoc(contactRef , contact)
            toast.success("Contact Added Successfully")
            onClose()
        } catch (error) {
            console.log(error)
        }
    }

    const updateContact =async (contact , id)=> {
        try {
            const contactRef = doc(db , "contacts" , id)
            await updateDoc(contactRef , contact)
            toast.success("Contact Updated Successfully")
            onClose()
        } catch (error) {
            console.log(error)
        }
    }





  return (
    <div>
        <Modal isOpen={isOpen} onClose={onClose}>
       <Formik 
       validationSchema={contactSchemaValidation}
       initialValues={ isUpdate ? {
        Name: contact.Name,
        email: contact.email,
       }
       : { Name: "",
        email: "",}
       }
            onSubmit={(values)=> {console.log(values)
                isUpdate ? updateContact(values , contact.id) :
                addContact(values)
            }}
       >
        <Form className="flex flex-col gap-3">
           <div className="flex flex-col gap-1">
           <label htmlFor="Name">Name</label>
           <Field name ="Name" className="h-10 border"/>

           <div className="text-red-500 text-xs">
                <ErrorMessage name ="Name"/>
           </div>
           </div>

           <div className="flex flex-col gap-1">
           <label htmlFor="email">Email</label>
           <Field  name ="email" className="h-10 border"/>

           <div className="text-red-500 text-xs">
                <ErrorMessage name ="email"/>
           </div>
           </div>

           <button className="bg-orange px-3 py-1.5 border self-end">
            {isUpdate ? "Update" : "Add"}  contact
           </button>
        </Form>
       </Formik>
      </Modal>
    </div>
  )
}

export default AddAndUpdate
