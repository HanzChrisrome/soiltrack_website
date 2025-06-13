import GradientHeading from "../../widgets/GradientComponent";
import { Layers2Icon, Mail, User, Users2 } from "lucide-react";
import CardContainer from "../../widgets/CardContainer";
import { IconInput } from "../../widgets/Widgets";
import { useState } from "react";
import PolygonMap from "./PolygonMap";
import { useUserStore } from "../../../store/AdminStore/useUserStore";

const AddUserWidget = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [polygonCoords, setPolygonCoords] = useState<
    { lat: number; lng: number }[][]
  >([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { insertUserAccount } = useUserStore();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email is invalid.";
    if (polygonCoords.length === 0)
      newErrors.polygon = "Please draw a plot for the user.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isInsertingUser = useUserStore((state) => state.isInsertingUser);

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.warn("Form has errors.");
      return;
    }
    await insertUserAccount(firstName, lastName, email, polygonCoords);
  };

  return (
    <div className="py-1">
      <CardContainer className="bg-base-300 p-5">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <IconInput
            icon={<User size={16} />}
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName ? errors.firstName : ""}
          />
          <IconInput
            icon={<User size={16} />}
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName ? errors.lastName : ""}
          />
          <IconInput
            icon={<Mail size={16} />}
            className="col-span-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email ? errors.email : ""}
          />
        </form>
      </CardContainer>

      {/* Show current plot names */}
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center gap-5">
          <Layers2Icon className="w-6 h-6 text-primary" />
          <GradientHeading className="text-3xl text-neutral-800 font-bold leading-tight">
            Draw the farmer/user plot
          </GradientHeading>
        </div>
        <PolygonMap onPolygonDrawn={setPolygonCoords} />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isInsertingUser}
        className={`btn bg-primary text-white w-full flex items-center rounded-lg gap-2 py-0 px-6 hover:bg-secondary mt-5 ${
          isInsertingUser ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {isInsertingUser ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            <span>Adding User...</span>
          </>
        ) : (
          <>
            <Users2 className="w-4" />
            <span className="font-normal">Add user</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AddUserWidget;
