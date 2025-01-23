import FarmForm from './FarmForm';
import { addFarm } from '../api/iptables';

const AddFarmForm = ({ isOpen, onClose, onFarmAdded }) => {
  const initialData = {
    upstreams: [{ ipaddress: "", port: "" }],
    port: "",
    algorithm: "round-robin",
    server_farm: "",
  };

  const handleAddFarm = async (farmData) => {
    await addFarm(farmData);
    onFarmAdded();
  };

  return (
    <FarmForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAddFarm}
      initialData={initialData}
      title="Add New Server Farm"
    />
  );
};

export default AddFarmForm;
