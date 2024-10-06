import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, REMOVE_PROFILE_IMAGE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";


const Profile = () => {
  const { userInfo } = useAppStore();
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [profileSetup, setProfileSetup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectColor, setSelectColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(()=>{
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectColor(userInfo.color);
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
    }
  },[userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      // Logic to save profile changes
      try{
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE, {
          firstName,
          lastName,
          color: selectColor
        }, {
          withCredentials: true
        });

        if(response.status==200&&response.data){
          setUserInfo({...response.data});
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }



      }catch(err){
        console.log(err);
      }
    }
  };

// navigation
  const handleNavigate =()=>{
      if(userInfo.profileSetup){
        navigate("/chat");
      }else{
        toast.error("Please setup profile.");
      }
  }

// handleFileInput

  const handleFileInputClick=()=>{
    alert("open");
    fileInputRef.current.click();

  }

  const handleImageChange= async(event)=>{
    const file = event.target.files[0];
    console.log({file});

    if(file){
      const formData =new FormData();
      formData.append("profile-image",file);
      const response =await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,{formData},{withCredentials:true});

      if(response.status==200&&response.data.image){
        console.log("success Image change");
        setUserInfo({...userInfo,image:response.data.image});
        toast.success("Image updated successfully");
      }
      const reader = new FileReader();

      reader.onload=()=>{
        setImage(reader.result);
      }
      reader.readAsDataURL(file);

    }
    
  }

  const handleDeleteChange=async()=>{
    try{
        const response = await apiClient.delete(REMOVE_PROFILE_IMAGE,{withCredentials:true});

        if(response.status==200){
          setUserInfo({...userInfo,image:null});
          toast.success("Image removed successfully.");
          setImage(null);
        }


    }catch(err){
      console.log(err);
    }
  }




  return (
    <div>
      <div
        className="bg-[1b1c24] h-[100vh] flex items-center 
      justify-center flex-col gap-10"
      >
        Profile

        <div className="flex flex-col gap-10 w-[80vh] md:w-max">
          <div onClick={handleNavigate}>
            <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
          </div>

          <div className="grid grid-cols-2">
            <div
              className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full
                  ${getColor(selectColor)}`}
                  >
                    {firstName
                      ? firstName.charAt(0).toUpperCase()
                      : userInfo.email.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>

              {hovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 cursor-pointer rounded-full"
                onClick={image?handleDeleteChange:handleFileInputClick}
                
                >
                  {image ? (
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-white text-3xl cursor-pointer"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-white text-3xl cursor-pointer"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Input Fields */}
            <input type="file" ref={(fileInputRef)} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png , .jpg , .jpeg , .svg , .webp"/>



            <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
              <div className="w-full">
                <Input
                  placeholder="Email"
                  type="email"
                  disabled
                  value={userInfo.email}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>

              <div className="w-full">
                <Input
                  placeholder="First Name"
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>

              <div className="w-full">
                <Input
                  placeholder="Last Name"
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>

              {/* Color selection */}
              <div className="w-full flex gap-5">
                {colors.map((color, index) => (
                  <div
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
                    ${selectColor === index ? "outline-white/50 outline-1" : ""}`}
                    key={index}
                    onClick={() => setSelectColor(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="w-full">
            <Button
              className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={saveChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
