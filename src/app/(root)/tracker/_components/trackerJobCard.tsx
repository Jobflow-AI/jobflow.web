import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { title } from "process";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowUpRight,
  Briefcase,
  Locate,
  MapPin,
  MessageSquare,
  Paperclip,
} from "lucide-react";
export const trackerJobCard = (
  job: any,
  setAppliedJobId?: any,
  viewMode?: boolean
) => {
  return (
    <Card key={job?._id} className="p-4 rounded-xl shadow-md">
      <div className="flex items-center justify-between">
        <Avatar className="w-8 h-8 border-2 border-white">
          <AvatarImage src={job?.company?.company_logo} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Badge variant={"outline"} className="bg-red-100 text-red-600 mb-2">
          Applied
        </Badge>
      </div>
      <h3 className="text-lg font-semibold mt-2">
        {job?.company?.company_name || "No Title"}
      </h3>
      <p className="text-sm text-gray-500">{job?.title || "No Company Name"}</p>

      <div className=" gap-2 mt-2">
        <div className="flex items-center gap-1">
          <MapPin size={15} className="text-green-500" />
          <span className="text-sm font-medium">{job?.job_location?.slice(0, 14)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Briefcase size={15} className="text-yellow-500" />
          <span className="text-sm font-medium">
            {job?.job_salary?.slice(0, 15) || "NA"} (LPA)
          </span>
        </div>
      </div>
    </Card>
  );
};
