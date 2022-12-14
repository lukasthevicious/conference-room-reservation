import { FC } from "react";
import { Feature } from "../../types/types";

type FeatureBoxProps = {
  feature: Feature;
  up?: boolean;
  down?: boolean;
};

const FeatureBox: FC<FeatureBoxProps> = ({ feature, up }) => {
  return (
    <li
      className={`${
        up ? "animate-floatUp" : "animate-floatDown"
      } flex flex-col justify-center items-center hover:shadow-2xl h-60 cursor-pointer  hover:bg-teal-600 w-64 lg:w-72 bg-teal-700 rounded-lg m-3 lg:m-5`}
    >
      {feature.icon}
      <h1 className="text-3xl lg:text-4xl mt-2 font-solid text-white">
        {feature.text}
      </h1>
    </li>
  );
};

export default FeatureBox;
