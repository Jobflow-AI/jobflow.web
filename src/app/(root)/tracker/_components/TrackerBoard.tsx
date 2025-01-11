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
  [key: string]: Job[];
}

export default function TrackerBoard() {
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();

  const [tasks, setTasks] = useState<Tasks>({});
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [columnInputValues, setColumnInputValues] = useState<string[]>([]);


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

  const initializeTasks = () => {
    const initialTasks = user?.job_statuses.reduce((acc: Tasks, statusObj: { label: string; value: number }) => {
      acc[statusObj.label] = [];
      return acc;
    }, {});
    setTasks(initialTasks || {});
    setColumnNames(user?.job_statuses.map(status => status.label) || []);
    setColumnInputValues(user?.job_statuses.map(status => status.label) || []);
  };

  useEffect(() => {
    initializeTasks();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const data = await getYourJobs();
      if (Array.isArray(data?.jobs)) {
        const organizedJobs = user?.job_statuses.reduce((acc: Tasks, statusObj: { label: string; value: number }) => {
          acc[statusObj.label] = data.jobs.filter((job: Job) => job.status === statusObj.label);
          return acc;
        }, {});
        setTasks(organizedJobs || {});
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

  const handleAddColumn = () => {
    const newColumnName = `new-column-${columnNames.length + 1}`;
    setTasks({ ...tasks, [newColumnName]: [] });
    setColumnNames([...columnNames, newColumnName]);
    setColumnInputValues([...columnInputValues, newColumnName]);
  };

  const handleColumnNameChange = (index: number, newName: string) => {
    const updatedColumnNames = [...columnNames];
    const oldName = updatedColumnNames[index];
    updatedColumnNames[index] = newName;
    setColumnNames(updatedColumnNames);

    const updatedTasks = { ...tasks, [newName]: tasks[oldName] };
    delete updatedTasks[oldName];
    setTasks(updatedTasks);

    const updatedStatuses = updatedColumnNames.map(label => ({ label, value: tasks[label]?.length || 0 }));
    updateUser({ job_statuses: updatedStatuses })
      .then(response => {
        if (response.success) {
          toast.success("Column name updated successfully");
          dispatch(userData(response.user));
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
    if (tasks[name].length > 0) {
      toast.error("Cannot remove a column that is not empty");
      return;
    }

    const updatedTasks = { ...tasks };
    delete updatedTasks[name];
    setTasks(updatedTasks);

    const updatedColumnNames = columnNames.filter((_, i) => i !== index);
    const updatedColumnInputValues = columnInputValues.filter((_, i) => i !== index);
    setColumnNames(updatedColumnNames);
    setColumnInputValues(updatedColumnInputValues);

    const updatedStatuses = updatedColumnNames.map(label => ({ label, value: tasks[label]?.length || 0 }));
    updateUser({ job_statuses: updatedStatuses })
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
  console.log(tasks, "here outside tasks");


  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const sourceList = [...tasks[source.droppableId]];
    const destinationList = [...tasks[destination.droppableId]];

    const [removed] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, removed);

    const updatedTasks = {
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    } as Tasks;

    setTasks(updatedTasks);

    const data = await updateJobStatus(removed.id, destination.droppableId); 

    const updatedStatuses = columnNames.map(label => ({ label, value: updatedTasks[label]?.length || 0 }));
    updateUser({ job_statuses: updatedStatuses })

    if (data.success) {
      toast.success(data.message || "Status updated");
    } else {
      toast.error(data.error);
      setTasks(tasks);
    }
  };

  return (
    <div className="flex flex-col w-full p-3 h-[91vh] overflow-y-hidden">
      <div className="flex justify-between items-center my-3 sticky top-0">
        <input
          type="text"
          placeholder="Search jobs..."
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
                      <button onClick={() => handleRemoveColumn(index, listName)} className="hover:bg-slate-300">✖️</button>
                    </div>
                    {tasks[listName]?.length === 0 && (
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
                    {tasks[listName]?.map((job: Job, index: number) => (
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
          defaultStatus={currentColumnName}
        />
      )}
    </div>
  );
}
