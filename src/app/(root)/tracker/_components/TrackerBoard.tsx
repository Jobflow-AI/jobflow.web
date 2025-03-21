'use client';

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { renderJobCard } from "./TrackerJobCard";
import { getYourJobs, updateJobStatus, updateUser } from "@/actions/user_actions";
import toast from "react-hot-toast";
import CreateJobModel from "./CreateJobModel";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/slices/userSlice";
import { Header } from "./Header";
import { Plus, MoreHorizontal } from 'lucide-react';

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
  }, [isModalOpen]);

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

  // console.log(tasks, "here outside tasks");


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
    <div className="flex flex-col w-full p-6 h-[91vh] overflow-y-hidden">
      <Header/>

      <div className="overflow-auto w-full h-full mt-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex w-full gap-6 h-full">
            {columnNames.map((listName, index) => (
              <Droppable droppableId={listName} key={listName}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 min-w-[200px] bg-[#17161c] rounded-3xl p-4 h-full overflow-auto relative group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={columnInputValues[index]}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleColumnNameChange(index, e.currentTarget.value);
                            }
                          }}
                          className="text-sm font-semibold text-gray-300 bg-transparent focus:bg-[#353345] focus:p-1 rounded focus:outline-none"
                        />
                        <span className="text-sm text-gray-500">
                          {tasks[listName]?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 hover:bg-[#353345] rounded transition-colors"
                          onClick={() => {
                            setCurrentColumnName(listName);
                            setIsModalOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                          onClick={() => handleRemoveColumn(index, listName)} 
                          className="p-1 hover:bg-[#353345] rounded transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {tasks[listName]?.map((job: Job, index: number) => (
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
                  </div>
                )}
              </Droppable>
            ))}
            <button 
              onClick={handleAddColumn} 
              className="p-2 h-10 bg-[#2F2D3B] text-gray-400 hover:bg-[#353345] rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
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
