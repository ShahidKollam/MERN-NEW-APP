import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'
import { updateUserFailure, updateUserSuccess, updateUserStart, } from "../redux/user/userSlice";
import { useParams } from "react-router-dom";
import axios from "axios";


function Profile() {
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const [image, setImage] = useState(undefined)
  const [user, setUser] = useState('')
  const [imagePercent, setImagePercent] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  

    const { user_id } = useParams()

    // console.log(user_id);
     //console.log(user);

    useEffect(() => {
        async function fetchUsers() {
          try {
            const response = await axios.get(`/api/user/${user_id}`);
            const userData = await response.data;
            setUser(userData);

          } catch (error) {
            console.error("Error fetching users:", error);
          }
        }
        fetchUsers();
      }, [user_id]);

  useEffect(()=>{
    if (image) {
        handleFileUpload(image)
    }
  },[image])


    const handleFileUpload = async(image)=>{
      const storage = getStorage(app)
      const fileName = new Date().getTime() + image.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef,image)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImagePercent(Math.round(progress));
        },
        (error) => {
          setImageError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            setFormData({ ...formData, profilePicture: downloadURL })
          );
        }
      );
    };


      const handleChange = (e)=>{
        setFormData({...formData, [e.target.id]: e.target.value})
      }

      const handleSubmit = async(e)=>{ 
        e.preventDefault()
        try {
          
          dispatch(updateUserStart())
          const res = await fetch(`/api/user/admin/update/${user_id}`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          const data = await res.json();
          console.log(data);
          if (data.success === false) {

            dispatch(updateUserFailure(data));
            return;
          }

          dispatch(updateUserSuccess(data));
          setUpdateSuccess(true);

        } catch (error) {
          dispatch(updateUserFailure(error));
        }
      };
    
      
      return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Edit User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input type="file" ref={fileRef} hidden accept="image/*"
        onChange={(e)=> setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || user.profilePicture}
          alt="profile"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          onClick={()=> fileRef.current.click()}
        />

        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>

        <input onChange={handleChange} defaultValue={user.username} type="text" id="username" placeholder="Username" className=" bg-slate-100 rounded-lg p-3" />
        <input onChange={handleChange} defaultValue={user.email} type="email" id="email" placeholder="Email" className=" bg-slate-100 rounded-lg p-3" />
        <input onChange={handleChange} type="password" id="password" placeholder="Password" className=" bg-slate-100 rounded-lg p-3" />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85 disabled:opacity-85">
          {loading ? 'Loading...' : 'Update'}
        </button>
      
        <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
        <p className='text-green-700 mt-5'>{updateSuccess && 'User is updated successfully!'}</p>
      </form>
    </div>
  );
}

export default Profile;
