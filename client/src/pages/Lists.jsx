import { useEffect, useState } from "react";
import axios from "axios";
import ListModal from "../components/ListModal";
import ListTable from "../components/ListTable";
import { toast } from "react-toastify";

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  const fetchLists = async () => {
    const res = await axios.get("/web/lists");
    setLists(res.data);
  };
  const handleSyncOne = async (id) => {
    await axios.post(`/api/lists/synchronize/${id}`);
    toast.success("Synchronized List!");

    fetchLists();
  };

  const handleEdit = (list) => {
    setSelectedList(list);
    setModalOpen(true);
  };

  const handleView = (list) => {
    setSelectedList(list);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedList(null);
    setModalOpen(false);
  };

  const handleSave = async (updatedList, isNew) => {
    if (isNew) {
      await axios.post("/web/lists", updatedList);
      toast.success("List created!");
    } else {
      await axios.put(`/web/lists/${updatedList.id}`, updatedList);
      toast.success("Changes saved!");
    }

    // Sync after save
    await axios.post(`/api/lists/synchronize/${updatedList.id}`);
    fetchLists();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/lists/${id}`);
    toast.success("Deleted List!");

    fetchLists();
    handleCloseModal();
  };

  const handleSyncAll = async () => {
    await axios.post("/api/lists/synchronize");
    toast.success("All Lists synchronized!");
    fetchLists();
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Product Lists</h1>
        <button
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
          onClick={handleSyncAll}
        >
          🔁 Synchronize
        </button>
      </div>

      <ListTable
        lists={lists}
        onEdit={handleEdit}
        onView={handleView}
        onCreate={() => setModalOpen(true)}
        onSync={handleSyncOne}
      />

      {modalOpen && (
        <ListModal
          list={selectedList}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Lists;
