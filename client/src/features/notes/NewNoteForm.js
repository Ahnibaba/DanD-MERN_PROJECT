import { useState, useEffect } from "react"
import { useAddNewNoteMutation } from "./notesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"



const NewNoteForm = ({ users }) => {

  const [addNewNote, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewNoteMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [userId, setUserId] = useState(users[0].id)
  const [status, setStatus] = useState(false)

  useEffect(() => {
    if(isSuccess){ 
      setTitle("")
      setText("")
      setUserId("")
      setStatus(false)
      navigate("/dash/notes")
    }
  }, [isSuccess, navigate])

  const onTitleChanged = e => setTitle(e.target.value)
  const onTextChanged = e => setText(e.target.value)
  const onStatusChanged = e => setStatus(prev => !prev)
  const onUserIdChanged = e => setUserId(e.target.value)


  const canSave = [title, text, userId].every(Boolean) && !isLoading

  const onSaveNoteClicked = async (e) => {
    e.preventDefault()
    if(canSave) {
      await addNewNote({ user: userId, title, text, completed: status })
    }
  }

  const options = users.map(user => {
    return (
      <option 
        key={user.id}
        value={user.id}
      >
        {user.username}
      </option>
    )
  })

  const errClass = isError ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ""
  const validTextClass = !text ? "form__input--incomplete" : ""
  const statusClass = status ? "note__status--completed" : "note__status--open"


  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveNoteClicked}>
         <div className="form__title-row">
             <button
               className="icon-button"
               title="Save"
               disabled={!canSave}
             >
               <FontAwesomeIcon icon={faSave} />
             </button>
         </div>
         <label className="form__input" htmlFor="title">
             Title: 
         </label>
         <input 
            className={`form__input ${validTitleClass}`}
            id="title"
            type="text" 
            autoComplete="off"
            value={title}
            onChange={onTitleChanged}

          />

          <label className="form__label" htmlFor="text">
             Text: 
          </label>
          <textarea 
            className={`form__input form__input--text ${validTextClass}`}
            name="text" 
            id="text" 
            value={text}
            onChange={onTextChanged}

          />

          <label className="form__label form__checkbox-container" htmlFor="username">
            ASSIGNED TO:
          </label>
          <select 
             name="username" 
             id="username"
             className="form__select"
             value={userId}
             onChange={onUserIdChanged}
          >
            {options}
          </select>

          <label className="form__label form__checkbox-container" htmlFor="status">
            STATUS: 
          </label>
          <input 
            className={`form__checkbox ${statusClass}`}
            id="status"
            type="checkbox" 
            value={status}
            onChange={onStatusChanged}

          />

         
      </form>
    </>
  )


  return content
}

export default NewNoteForm