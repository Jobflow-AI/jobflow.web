import React from 'react'

const CreateJobModel = ({newJob, setNewJob, setIsModalOpen, handleCreateJob}: {
    newJob: any, 
    setNewJob: any, 
    setIsModalOpen: any,
    handleCreateJob: any
}) => {
  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-md p-6 w-1/3">
            <h3 className="text-xl font-bold mb-4">Create New Job</h3>
            {Object.keys(newJob).map((key) => (
              <div key={key} className="mb-4">
                <label className="block font-bold">{key.replace(/_/g, " ")}</label>
                <input
                  type="text"
                  value={newJob[key as keyof typeof newJob]}
                  onChange={(e) =>
                    setNewJob({ ...newJob, [key]: e.target.value })
                  }
                  className="border rounded-md px-4 py-2 w-full"
                />
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleCreateJob}>
                Create
              </button>
            </div>
          </div>
        </div>
    </>
  )
}

export default CreateJobModel