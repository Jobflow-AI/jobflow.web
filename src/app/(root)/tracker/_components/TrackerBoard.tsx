'use client';

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { renderJobCard } from "@/components/shared/jobCard";
import { getYourJobs, updateJobStatus, updateUser } from "@/actions/user_actions";
import toast from "react-hot-toast";
import CreateJobModel from "./CreateJobModel";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/slices/userSlice";

interface Job {
  id: string;
  status: string;
  job: Job[]
}

interface Tasks {
    bookmarked: Job[];
    applied: Job[];
    accepted: Job[];
    rejected: Job[];
}

export default function TrackerBoard() {
  const user = useAppSelector(state => state.user.user)

  const dispatch = useAppDispatch()

  const [tasks, setTasks] = useState<any>(
    user?.job_statuses.reduce((acc: any, status: string) => {
      acc[status] = [];
      return acc;
    }, {})
  );

  console.log(tasks, "here")

  const [columnNames, setColumnNames] = useState<string[]>(Object?.keys(tasks));
  const [columnInputValues, setColumnInputValues] = useState<string[]>(columnNames);

  const [newJob, setNewJob] = useState({
    title: "",
    job_link: "",
    job_type: "",
    apply_link: "",
    job_location: "",
    job_salary: "",
    job_description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentColumnName, setCurrentColumnName] = useState<string>("");

  const fetchJobs = async () => {
    try {
      const data = await getYourJobs();
      if (Array.isArray(data?.jobs)) {
        const organizedJobs = user?.job_statuses.reduce((acc: any, status: string) => {
          acc[status] = data.jobs.filter((job: Job) => job.status === status);
          return acc;
        }, {});
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

  const handleCreateJob = async() => {
    console.log("creating job")
  }

  const handleAddColumn = () => {
    const newColumnName = `new-column-${columnNames.length + 1}`;
    setTasks({ ...tasks, [newColumnName]: [] });
    setColumnNames([...columnNames, newColumnName]);
    setColumnInputValues([...columnInputValues, newColumnName]);
  };

  const handleColumnNameChange = (index: number, newName: string) => {
    const updatedColumnNames = [...columnNames];
    updatedColumnNames[index] = newName;
    setColumnNames(updatedColumnNames);

    // Update tasks with new column name
    const updatedTasks = { ...tasks };
    updatedTasks[newName] = updatedTasks[columnNames[index]];
    delete updatedTasks[columnNames[index]];
    setTasks(updatedTasks);

    // Extract keys of tasks as string array
    const taskKeys = Object.keys(updatedTasks);

    // Call updateUser action with task keys
    console.log(taskKeys, "here are updated task keys");
    updateUser({"job_statuses": taskKeys})
      .then(response => {
        if (response.success) {
          toast.success("Column name updated successfully");
          dispatch(userData(response.user))
        } else {
          toast.error("Failed to update column name");
        }
      })
      .catch(error => {
        console.error("Error updating column name:", error);
        toast.error("Error updating column name");
      });
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInputValues = [...columnInputValues];
    updatedInputValues[index] = value;
    setColumnInputValues(updatedInputValues);
  };

  const handleRemoveColumn = (index: number, name: string) => {
     // Check if the column is empty
    if (tasks[name].length > 0) {
      toast.error("Cannot remove a column that is not empty");
      return;
    }

    // Remove the column from tasks
    const updatedTasks = { ...tasks };
    delete updatedTasks[name];
    setTasks(updatedTasks);

    // Remove the column name from columnNames and columnInputValues
    const updatedColumnNames = columnNames.filter((_, i) => i !== index);
    const updatedColumnInputValues = columnInputValues.filter((_, i) => i !== index);
    setColumnNames(updatedColumnNames);
    setColumnInputValues(updatedColumnInputValues);

    console.log(updatedColumnNames, "here")
    // Update userData with the new column names
    updateUser({ "job_statuses": updatedColumnNames })
        .then(response => {
            if (response.success) {
                toast.success("Column removed successfully");
                dispatch(userData(response.user));
            } else {
                toast.error("Failed to update user data");
            }
        })
        .catch(error => {
            console.error("Error updating user data:", error);
            toast.error("Error updating user data");
        });
};


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
    <div className="flex flex-col border p-3 h-[91vh] overflow-y-hidden">
      <div className="flex justify-between items-center my-3 sticky top-0">
        <input
          type="text"
          placeholder="Search jobs..."
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md px-4 py-2 w-1/2"
        />
        <div className="flex gap-4">
          <button className="btn-secondary" onClick={() => alert("Filter functionality here")}>
            Filter
          </button>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            Create Job
          </button>
        </div>
      </div>

      <div className="overflow-auto w-full h-full">

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex w-full gap-4 h-full">
          {columnNames.map((listName, index) => (
            <Droppable droppableId={listName} key={listName}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="border rounded-md p-4 bg-gray-100 min-w-[250px] h-full overflow-auto relative group"
                >
                  <div className="flex justify-between">
                  <input
                    type="text"
                    value={columnInputValues[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleColumnNameChange(index, e.currentTarget.value);
                      }
                    }}
                    className="font-bold capitalize bg-transparent focus:bg-slate-200 focus:p-1"
                  />
                  <button onClick={() => handleRemoveColumn(index, listName)} className="hover:bg-slate-300"> ✖️ </button>
                  </div>
                  {tasks[listName as keyof Tasks]?.length === 0 && (
                    <div 
                      className="inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <button
                        className="w-full my-3 bg-gray-300 p-1 rounded-sm"
                        onClick={() => {
                          setCurrentColumnName(listName);
                          setIsModalOpen(true);
                        }}
                      >
                        Create Job ➕
                      </button>
                    </div>
                  )}
                  
                  {tasks[listName as keyof Tasks]?.map((job: Job, index: number) => (
                    <Draggable draggableId={job.id} index={index} key={job.id}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="my-3"
                        >
                          {renderJobCard(job.job, "", true)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <button onClick={handleAddColumn} className="px-2 bg-gray-400">
          ➕
          </button>
        </div>
      </DragDropContext>
      
    </div>
    {isModalOpen && (
        <CreateJobModel 
          newJob={newJob} 
          setNewJob={setNewJob} 
          setIsModalOpen={setIsModalOpen} 
          handleCreateJob={handleCreateJob} 
          defaultStatus={currentColumnName}
        />
      )}
    </div>
  );
}