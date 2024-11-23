'use client';

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { renderJobCard } from "@/components/shared/jobCard"; // If needed for job card rendering
import { getYourJobs, updateJobStatus } from "@/actions/user_actions";
import toast from "react-hot-toast";

interface Job {
  id: string;
  status: string;
  job: Job[]
  // Add other job properties as needed
}

interface Tasks {
    bookmarked: Job[];
    applied: Job[];
    accepted: Job[];
    rejected: Job[];
}

export default function TrackerBoard() {
  const [tasks, setTasks] = useState<Tasks>({
    bookmarked: [],
    applied: [],
    accepted: [],
    rejected: [],
  });

  const fetchJobs = async () => {
    try {

      const data = await getYourJobs();
      if (Array.isArray(data?.jobs)) {
        const organizedJobs = {
          bookmarked: data.jobs.filter((job: Job) => job.status === 'bookmarked'),
          applied: data.jobs.filter((job: Job) => job.status === 'applied'),
          accepted: data.jobs.filter((job: Job) => job.status === 'accepted'),
          rejected: data.jobs.filter((job: Job) => job.status === 'rejected'),
        };
        setTasks(organizedJobs);
      } else {
        console.error("Unexpected data format", data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };


  useEffect(() => {
    fetchJobs();
  }, []);

  console.log(tasks, "hera are task")

  // Function to handle drag and drop
  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    // If no destination, return
    if (!destination) return;

    // If the source and destination are the same, return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    console.log(source.draggableId, "here droppaleId", destination.droppableId)

    // Get the source and destination lists
    const sourceList = [...tasks[source.droppableId as keyof Tasks]];
    const destinationList = [...tasks[destination.droppableId as keyof Tasks]];

    // Remove the dragged item from the source list
    const [removed] = sourceList.splice(source.index, 1);

    // Add the dragged item to the destination list
    destinationList.splice(destination.index, 0, removed);

    // Update the state with the new lists
    setTasks({
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    });

        const data = await updateJobStatus(removed.id, destination.droppableId);
        if(data.success) {
            toast.success(data.message || "Status updated")
        } else {
            toast.error(data.error)
            setTasks(tasks)
        }
        

  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(tasks).map((listName) => (
          <Droppable droppableId={listName} key={listName}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="border rounded-md p-4 bg-gray-100 min-h-[200px]"
              >
                <h3 className="font-bold capitalize">{listName}</h3>
                {tasks[listName as keyof Tasks].map((job: Job, index: number) => (
                  <Draggable draggableId={job.id} index={index} key={job.id}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        {renderJobCard(job.job, '' , true)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
