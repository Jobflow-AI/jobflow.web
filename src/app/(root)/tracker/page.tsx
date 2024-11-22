'use client';

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getJobData } from "@/actions/data_actions"; // Make sure to have this function to fetch jobs
import { renderJobCard } from "@/components/shared/jobCard"; // If needed for job card rendering

interface Job {
  id: string;
  status: string;
  // Add other job properties as needed
}

interface Tasks {
  todo: Job[];
  inProgress: Job[];
  done: Job[];
  accepted: Job[];
}

export default function Tracker() {
  const [tasks, setTasks] = useState<Tasks>({
    todo: [],
    inProgress: [],
    done: [],
    accepted: []
  });

  const fetchJobs = async () => {
    try {
      const page = 1;
      const portal = '';
      const title = '';
      const data = await getJobData(page, portal, title); // Modify this to accept parameters if needed
      if (Array.isArray(data?.jobs)) {
        const organizedJobs = {
          todo: data.jobs.filter((job: Job) => job),
          inProgress: data.jobs.filter((job: Job) => job.status === ''),
          done: data.jobs.filter((job: Job) => job.status === ''),
          accepted: data.jobs.filter((job: Job) => job.status === ''),
        };
        setTasks(organizedJobs);
      } else {
        console.error("Unexpected data format", data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  console.log(tasks);

  useEffect(() => {
    fetchJobs();
  }, []);

  // Function to handle drag and drop
  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // If no destination, return
    if (!destination) return;

    // If the source and destination are the same, return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

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
                        {renderJobCard(job)}
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
