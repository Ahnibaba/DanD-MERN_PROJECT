import { useParams } from 'react-router-dom'
//import { useSelector } from 'react-redux'
//import { selectNoteById } from './notesApiSlice'
//import { selectAllUsers } from '../users/usersApiSlice'
import EditNoteForm from './EditNoteForm'
import { useGetNotesQuery } from './notesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'


const EditNote = () => {
    useTitle("Edit Note")

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    //const note = useSelector(state => selectNoteById(state, id))
    //const users = useSelector(selectAllUsers)

    const { note } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[id]
        }),
    }) 

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
       })  

       if(!note || !users?.length) return <PulseLoader color={"#FFF"} />


       if(!isManager && !isAdmin) {
           if (note.username !== username) {
              return <p className='errmsg'>No access</p>
           }
       }
    const content = <EditNoteForm note={note} users={users} /> 

    return content
}
export default EditNote