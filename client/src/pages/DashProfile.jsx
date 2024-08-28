import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useDispatch } from 'react-redux'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutSuccess, updateInFailure, updateInStart, updateInSuccess } from '../redux/user/userSlice'
import {HiOutlineExclamationCircle} from 'react-icons/hi'


export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData,setFormData]=useState({});
  const [imageFileUploading,setImageFileUploading]= useState(false)
  const [updateUserError,setUpdateUserError] = useState(null);
  const [updateUserSuccess,setUpdateUserSuccess]=useState(null)
  const [showModal,setShowModal]= useState(false);
  const refFilePicker = useRef();
  const dispatch = useDispatch();
  console.log(imageFileUploadProgress, imageFileUploadError);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile])


  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
      setImageFileUploading(true);
    setImageFileUploadError(null);
  
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formData, profilePicture: downloadURL});
        });
      }
    );
  };
  //on change form data
  const handleChange =  (e) => {
    setFormData({...formData,[e.target.id]: e.target.value});
    setImageFileUploading(false);
  }
    console.log(formData);

    //handle submit of update user form data
    const handleSubmit = async (e) => {
      e.preventDefault();
      setUpdateUserError(null);
      setUpdateUserSuccess(null)
      if(Object.keys(formData) === 0){
        return setUpdateUserError('No cahnges mode');
      }
      //  if(imageFileUploading){
      //    return setImageFileUploadError('Please wait for image upload');
        
      //  }
      try {
        dispatch(updateInStart());
        const res = await fetch(`/api/v1/user/update/${currentUser._id}`,{
          method: 'PUT',
          headers:{'Content-Type' : 'application/json'},
          body: JSON.stringify(formData),
        },
      )
      const data = await res.json();
      if(!res.ok){
        dispatch(updateInFailure(data.message));
        setUpdateUserError(data.message);
        
      }else{
        dispatch(updateInSuccess(data))
        setUpdateUserSuccess("User update successfully");
       
      }
        
      } catch (error) {
        dispatch(updateInFailure(error.message));
        setUpdateUserError(error.message);
      }
    }

    // Delete the user
    const  handleDelete = async () => {
      setShowModal(false);
      try {
        dispatch(deleteUserStart());
        const res =await fetch(`/api/v1/user/delete/${currentUser._id}`,{
          method: "DELETE",
        });
        const data =await res.json();
          if(!res.ok){
            dispatch(deleteUserFailure(data.message));

          }else{
            dispatch(deleteUserSuccess(data));
          }
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }

    // sign out the user
    const handleSignOut=async () => {
      try {
        const res = await fetch('/api/v1/user/signOut',{
          method: 'POST',
        });
        const data=await res.json();
        if(!res.ok){
          console.log(data.message);
        }else{
          dispatch(signOutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    /*========================================                 ==========================================*/
  return (
    
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='file' accept='image/.*' onChange={handleImageChange} ref={refFilePicker} hidden />
        <div className='relative w-32 h-32 self-center shadow-md overflow-hidden rounded-full cursor-pointer' onClick={() => refFilePicker.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`
                },
              }}
            />
          )}

          <img src={imageFileUrl || currentUser.profilePicture} alt="user" title='user' className='rounded-full w-full h-full object-cover border-8 border-[light-gray]' />
        </div>
        {imageFileUploadError && (
          <Alert color={'red'}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}

        />
        <Button
          type='submit'
          gradientDuoTone={'greenToBlue'} outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert className='mt-5' color={'green'}>{updateUserSuccess}</Alert>
      )}
      {updateUserError && (
        <Alert className='mt-5' color={'red'}>{updateUserError}</Alert>
      )}

      
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header/>
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className='h-12 w-12 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-200'>Are you sure you want to delete your account?</h3>
              </div>
              <div className='flex justify-center gap-4'>
                <Button color={'failure'} onClick={handleDelete}>Yes, I'm sure</Button>
                <Button color={'gray'} onClick={() => setShowModal(false)}>No, cancel</Button>
              </div>
            </Modal.Body>
        </Modal>
      
    </div>
  )
}
