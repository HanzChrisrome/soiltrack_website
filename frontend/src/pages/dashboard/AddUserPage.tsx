import GradientHeading from "../../components/widgets/GradientComponent";
import { Layers2, Tractor, UploadCloud, User } from "lucide-react";
import CardContainer from "../../components/widgets/CardContainer";
import { IconInput } from "../../components/widgets/Widgets";
import { useState } from "react";
import PolygonMap from "../../components/UserPage/PolygonMap";

const getLetter = (index: number) => String.fromCharCode(65 + index);

const AddUserPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [plots, setPlots] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [isPolygonDrawn, setIsPolygonDrawn] = useState(false);

  const handleAddPlot = () => {
    if (!firstName || !lastName) {
      alert("Please enter first and last name first.");
      return;
    }

    const nextPlotName = `${firstName} Plot ${getLetter(plots.length)}`;
    setPlots([...plots, nextPlotName]);
    setShowMap(true);
    setIsPolygonDrawn(false);
  };

  return (
    <div className="py-5">
      <div className="flex items-center gap-5">
        <Tractor className="w-6 h-6 text-primary" />
        <GradientHeading className="text-3xl text-neutral-800 font-bold leading-tight">
          Add a User or Farmer
        </GradientHeading>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <CardContainer>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <IconInput
              icon={<User size={16} />}
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <IconInput
              icon={<User size={16} />}
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <IconInput
              icon={<User size={16} />}
              className="col-span-2"
              placeholder="Email"
              type="email"
            />
            <div className="flex items-center justify-center w-full col-span-2">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-base-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />

                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop for the Profile Picture
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </form>
        </CardContainer>

        <CardContainer>
          <button
            onClick={handleAddPlot}
            className="btn bg-base-100 w-full flex items-center rounded-lg gap-2 py-0 px-6 hover:bg-base-200"
          >
            <Layers2 className="w-4" />
            <span className="font-normal">Add a plot</span>
          </button>

          {/* Show current plot names */}
          <ul className="mt-4 text-sm text-gray-600 list-disc list-inside">
            {plots.map((plot, index) => (
              <li key={index}>{plot}</li>
            ))}
          </ul>
        </CardContainer>
      </div>
      {showMap && (
        <div className="mt-5">
          <PolygonMap onPolygonDrawn={() => setIsPolygonDrawn(true)} />
        </div>
      )}
    </div>
  );
};

export default AddUserPage;
