'use client';

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { renderJobCard } from "./TrackerJobCard";
import { 
  getYourJobs, 
  updateJobStatus, 
  updateUser, 
  addUserJobStatuses, 
  deleteUserJobStatuses,
  updateUserJobStatuses  // Add this import
} from "@/actions/user_actions";
import toast from "react-hot-toast";
import CreateJobModel from "./CreateJobModel";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/slices/userSlice";
import { Header } from "./Header";
import { Plus, Minus } from 'lucide-react';

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
  const [jobsCache, setJobsCache] = useState<Job[]>([]);

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

  // Modify initializeTasks to preserve jobs
  const initializeTasks = () => {
    const initialTasks = user?.job_statuses.reduce((acc: Tasks, statusObj: { label: string; value: number }) => {
      // Preserve existing jobs if column already exists
      acc[statusObj.label] = tasks[statusObj.label] || [];
      return acc;
    }, {});
    setTasks(initialTasks || {});
    setColumnNames(user?.job_statuses.map(status => status.label) || []);
    setColumnInputValues(user?.job_statuses.map(status => status.label) || []);
  };

  // Update fetchJobs to merge with cache
  const fetchJobs = async () => {
    try {
      const data = await getYourJobs();
      if (data?.success && Array.isArray(data.jobs)) {
        setJobsCache(data.jobs);
        const organizedJobs = user?.job_statuses.reduce((acc: Tasks, statusObj) => {
          acc[statusObj.label] = data.jobs.filter((job: { status: string }) => job.status === statusObj.label);
          return acc;
        }, {});
        // Merge with existing tasks
        setTasks(prev => ({ ...prev, ...organizedJobs }));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Update useEffect dependencies
  useEffect(() => {
    initializeTasks();
    // Fetch jobs only on initial mount or when jobs change
  }, []); // Remove user dependency

  useEffect(() => {
    // Only refresh jobs when modal closes (new job added)
    if (!isModalOpen) {
      fetchJobs();
    }
  }, [isModalOpen]);

  // Update column handlers to preserve jobs
  const handleAddColumn = () => {
    const newColumnName = `new-column-${columnNames.length + 1}`;
    const updatedColumnNames = [...columnNames, newColumnName];
    
    setTasks({ ...tasks, [newColumnName]: [] });
    setColumnNames(updatedColumnNames);
    setColumnInputValues([...columnInputValues, newColumnName]);
  
    // Only send the new column data
    addUserJobStatuses({ 
      label: newColumnName,
      value: 0 // Initial value for new column
    }).then(response => {
      if (response.success) {
        toast.success("Column added successfully");
        dispatch(userData(response.user));
      } else {
        toast.error("Failed to add column");
      }
    }).catch(error => {
      console.error("Error adding column:", error);
      toast.error("Error adding column");
    });
  };

  const handleColumnNameChange = (index: number, newName: string) => {
    const updatedColumnNames = [...columnNames];
    const oldName = updatedColumnNames[index];
    updatedColumnNames[index] = newName;
    setColumnNames(updatedColumnNames);
  
    const updatedTasks = { ...tasks, [newName]: tasks[oldName] };
    delete updatedTasks[oldName];
    setTasks(updatedTasks);
  
    // Find the existing status to get its ID
    const existingStatus = user?.job_statuses.find(js => js.label === oldName);
    if (!existingStatus) {
      toast.error("Column not found");
      return;
    }
  
    // Update with status ID and new data
    updateUserJobStatuses(existingStatus.id, {
      label: newName,
      value: tasks[oldName]?.length || 0
    }).then(response => {
      if (response.success) {
        toast.success("Column name updated successfully");
        dispatch(userData(response.user));
      } else {
        toast.error("Failed to update column name");
      }
    }).catch(error => {
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
  
    // Find the job status ID to delete
    const statusToDelete = user?.job_statuses.find(js => js.label === name);
    if (!statusToDelete) {
      toast.error("Column not found");
      return;
    }
  
    deleteUserJobStatuses(statusToDelete.id)
      .then(response => {
        if (response.success) {
          // Update local state
          const updatedTasks = { ...tasks };
          delete updatedTasks[name];
          setTasks(updatedTasks);
  
          const updatedColumnNames = columnNames.filter((_, i) => i !== index);
          const updatedColumnInputValues = columnInputValues.filter((_, i) => i !== index);
          setColumnNames(updatedColumnNames);
          setColumnInputValues(updatedColumnInputValues);
  
          toast.success("Column removed successfully");
          dispatch(userData(response.user));
        } else {
          toast.error("Failed to delete column");
        }
      })
      .catch(error => {
        console.error("Error deleting column:", error);
        toast.error("Error deleting column");
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
    
    // Refresh jobs after status update
    await fetchJobs();  // Add this line

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
    <div className="flex flex-col w-full h-[91vh] overflow-hidden pl-8">
      <Header />

      <div className="flex-1 overflow-hidden mt-3">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 w-full h-full overflow-x-auto">
            {columnNames.map((listName, index) => (
              <Droppable droppableId={listName} key={listName}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-w-[300px] bg-[#17161c] rounded-3xl p-4 h-full overflow-auto relative group"
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
                          <Minus className="w-4 h-4 text-gray-400" />
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
                              {renderJobCard(job.job)}
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

