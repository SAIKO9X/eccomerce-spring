import { Divider } from "@mui/material";

export const ProfileFieldCard = ({ keys, value }) => {
  return (
    <div className="p-5 flex items-center bg-zinc-100 rounded-xs">
      <p className="w-20 lg:w-36 pr-5">{keys}</p>
      <Divider orientation="vertical" flexItem />
      <p className="pl-4 lg:pl-10 font-medium">{value}</p>
    </div>
  );
};
