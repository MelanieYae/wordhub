import { User, UserContext } from "../providers/UserProvider";
import { api, uploadImage } from "../utils/api";
import { useState, useContext } from "react";
export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState('')

  const [showSuccess, setShowSuccess] = useState(false)

  const [data, setData] = useState({
    username: user?.username,
    imageUrl: user?.imageUrl,
    password: "",
  });

  async function updateUser(user: User) {
    setError('')
    const filteredUser = Object.fromEntries(
      Object.entries(user).filter(
        ([_, value]) => value !== null && value !== ""
      )
    );

    const res = await api.post("/user/update_profile", filteredUser);
    if (res.status === 200) {
      setUser(user)
      showSuccessMessage()
      setData({ ...data, password: '' })
    } else {
      setError(res.data?.error)
    }
    
  }

  function showSuccessMessage() {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 1500)
  }

  async function onImageInput(event: any) {
    const file = event.target?.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        data.imageUrl = url;
        await updateUser(data);
        showSuccessMessage()
      }
    }
  }

  function onSave() {
    updateUser(data)
  }

  return (
    <div className="flex flex-col items-center pt-10 m-auto w-[300px]">
      <div className="relative">
        <label htmlFor="fileInput">
          <img
            className="w-[80px] h-[80px] rounded-full shadow-lg cursor-pointer object-cover"
            src={user?.imageUrl ?? "/static/profile_placeholder.png"}
          />
        </label>

        <input
          onInput={onImageInput}
          id="fileInput"
          type="file"
          className="w-full h-full"
          hidden
        />



      </div>
      <div className="pt-5 w-full">
        <label
          htmlFor="first_name"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Username
        </label>
        <input
          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
          placeholder=""
          value={data?.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
      </div>

      <div className="pt-5 w-full">
        <label
          htmlFor="first_name"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Password
        </label>
        <input
          type="password"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
          placeholder="New password..."
          value={data?.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </div>
      
      <button
        onClick={onSave}
        type="button"
        className="w-full mt-5 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      >
        Save
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {showSuccess && <p className="text-green-700">update successfuly!</p>}
    </div>
  );
}
