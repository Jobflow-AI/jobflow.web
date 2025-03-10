'use client';

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { getYourJobs, updateJobStatus, updateUser } from "@/actions/user_actions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/slices/userSlice";
import TaskCard from "./TaskCard";
import CreateJobModal from "./CreateJobModel";

interface Job {
  id: string;
  status: string;
  title: string;
  company?: {
    company_name: string;
    company_logo: string;
  };
  job_link?: string;
  job_salary?: string;
  work_type?: string;
  job_location?: string;
  source?: string;
}

interface Tasks {
  [key: string]: Job[];
}

// Column styles based on status
const getColumnStyles = (status: string) => {
  switch(status.toLowerCase()) {
    case 'backlog':
      return { dot: 'bg-gray-500', bg: 'bg-gray-50' };
    case 'to do':
    case 'applied':
      return { dot: 'bg-blue-500', bg: 'bg-blue-50' };
    case 'in progress':
    case 'accepted':
      return { dot: 'bg-yellow-500', bg: 'bg-yellow-50' };
    case 'need review':
    case 'rejected':
      return { dot: 'bg-red-500', bg: 'bg-red-50' };
    case 'done':
    case 'closed':
      return { dot: 'bg-green-500', bg: 'bg-green-50' };
    default:
      return { dot: 'bg-gray-500', bg: 'bg-white' };
  }
};

export default function TrackerBoard() {
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();

  const [tasks, setTasks] = useState<Tasks>({});
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [columnInputValues, setColumnInputValues] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    const newColumnName = `New Column`;
    setTasks({ ...tasks, [newColumnName]: [] });
    setColumnNames([...columnNames, newColumnName]);
    setColumnInputValues([...columnInputValues, newColumnName]);

    const updatedStatuses = [...columnNames, newColumnName].map(label => ({ 
      label, 
      value: tasks[label]?.length || 0 
    }));

    updateUser({ job_statuses: updatedStatuses })
      .then(response => {
        if (response.success) {
          toast.success("Column added successfully");
          dispatch(userData(response.user));
        } else {
          toast.error("Failed to add column");
        }
      })
      .catch(error => {
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

    const updatedStatuses = updatedColumnNames.map(label => ({ 
      label, 
      value: updatedTasks[label]?.length || 0 
    }));
    
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

    const updatedStatuses = updatedColumnNames.map(label => ({ 
      label, 
      value: updatedTasks[label]?.length || 0 
    }));
    
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
  const columnColors = [
  { dot: 'bg-gray-500', text: 'text-gray-700',bg: 'bg-gray-200' },
  { dot: 'bg-blue-500', text: 'text-blue-700',bg: 'bg-blue-200' },
  { dot: 'bg-yellow-500', text: 'text-yellow-700',bg:'bg-yellow-200' },
  { dot: 'bg-red-500', text: 'text-red-700',bg: 'bg-red-200' },
  { dot: 'bg-green-500', text: 'text-green-700',bg: 'bg-green-200' },
  { dot: 'bg-purple-500', text: 'text-purple-700',bg: 'bg-purple-200' },
  { dot: 'bg-indigo-500', text: 'text-indigo-700',bg: 'bg-indigo-200' },
  { dot: 'bg-pink-500', text: 'text-pink-700' ,bg:'bg-pink-200'},
];
  const getColumnStyleByIndex = (index: number) => {
    return columnColors[index % columnColors.length];
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    // Implement search logic here
  };

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

    const updatedStatuses = columnNames.map(label => ({ 
      label, 
      value: updatedTasks[label]?.length || 0 
    }));
    
    updateUser({ job_statuses: updatedStatuses })
      .then(response => {
        if (response.success) {
          dispatch(userData(response.user));
        }
      });

    if (data.success) {
      toast.success(data.message || "Status updated");
    } else {
      toast.error(data.error);
      setTasks(tasks);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 h-screen overflow-hidden bg-gray-50">
      <div className="flex justify-between items-center my-4 sticky top-0 z-10">
        <input
          type="text"
          placeholder="Search tasks..."
          className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="flex gap-4">
          <button 
            className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-100"
            onClick={() => alert("Filter functionality here")}
          >
            Filter
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Create Task
          </button>
        </div>
      </div>

      <div className="overflow-auto w-full h-full pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full">
          {columnNames.map((listName, index) => {
  const columnStyle = getColumnStyleByIndex(index);
  
  return (
    <Droppable droppableId={listName} key={listName}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="rounded-lg p-4 w-76 min-w-72 h-fit h-full overflow-auto border border-gray-200"
        >
          <div className={`flex items-center py-4 gap-2 mb-4 rounded-lg ${columnStyle.bg}`}>
            <div className={`w-2 h-2 rounded-full  ${columnStyle.dot} ml-4`}></div>
            <input
              type="text"
              value={columnInputValues[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onBlur={(e) => handleColumnNameChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleColumnNameChange(index, e.currentTarget.value);
                }
              }}
              className={`font-medium capitalize bg-transparent focus:bg-white focus:p-1 focus:outline-none focus:ring-1 focus:ring-gray-300 rounded ${columnStyle.text}`}
            />
            <div className="ml-auto">
              <button 
                onClick={() => handleRemoveColumn(index, listName)} 
                className="w-4 h-4 relative right-2 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Rest of the column content */}
          {tasks[listName]?.map((job: Job, index: number) => (
            <Draggable draggableId={job.id} index={index} key={job.id}>
              {(provided) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  <TaskCard job={job} />
                </div>
              )}
            </Draggable>
          ))}
          
          {provided.placeholder}
          
          <div className="mt-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button
              className="w-full bg-white bg-opacity-70 py-2 px-4 rounded-lg text-gray-600 hover:bg-opacity-100 transition-all border border-dashed border-gray-300"
              onClick={() => {
                setCurrentColumnName(listName);
                setIsModalOpen(true);
              }}
            >
              + Add task
            </button>
          </div>
        </div>
      )}
    </Droppable>
  );
})}
            
            <div className="min-w-12 flex items-start pt-4">
              <button 
                onClick={handleAddColumn} 
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </DragDropContext>
      </div>
      
      {isModalOpen && (
        <CreateJobModal 
          newJob={newJob} 
          setNewJob={setNewJob} 
          setIsModalOpen={setIsModalOpen} 
          defaultStatus={currentColumnName}
        />
      )}
    </div>
  );
}