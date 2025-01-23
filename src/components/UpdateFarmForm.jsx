import FarmForm from './FarmForm';
import { updateFarm } from '../api/iptables';

const UpdateFarmForm = ({ isOpen, onClose, onFarmUpdated, farmData }) => {
  if (!farmData) return null;

  const handleUpdateFarm = async (updatedFarmData) => {
    await updateFarm(updatedFarmData);
    onFarmUpdated();
  };

  return (
    <FarmForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleUpdateFarm}
      initialData={farmData}
      title="Update Server Farm"
    />
  );
};

export default UpdateFarmForm;
