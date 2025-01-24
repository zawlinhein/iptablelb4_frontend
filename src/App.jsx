import { useState, useEffect } from 'react';
import { Box, Button, Container, Heading, Stack, Text, VStack, Alert, AlertIcon, useDisclosure, CloseButton } from '@chakra-ui/react';
import { fetchServerFarms, fetchFarmDetails, deleteFarm, checkHealth } from './api/iptables';
import AddFarmForm from './components/AddFarmForm';
import FarmDetails from './components/FarmDetails';
import './App.css';

function App() {
  const [serverFarms, setServerFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [healthCheckFailed, setHealthCheckFailed] = useState(false);
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  useEffect(() => {
    performHealthCheck();
  }, []);

  const performHealthCheck = async () => {
    try {
      const response = await checkHealth();
      console.log({response});
      if (response.status === 200) {
        loadServerFarms();
      } else {
        setHealthCheckFailed(true);
      }
    } catch (error) {
      setHealthCheckFailed(true);
      console.error('Health check failed:', error);
    }
  };

  const loadServerFarms = async () => {
    try {
      const farms = await fetchServerFarms();
      setServerFarms(farms);
    } catch (error) {
      console.error('Error loading server farms:', error);
    }
  };

  const handleFetchFarmDetails = async (farm) => {
    try {
      const farmDetails = await fetchFarmDetails(farm);
      setSelectedFarm(farmDetails);
    } catch (error) {
      console.error('Error fetching farm details:', error);
    }
  };

  const handleDeleteFarm = async (farm) => {
    try {
      await deleteFarm(farm);
      if (selectedFarm && selectedFarm.server_farm === farm) {
        setSelectedFarm(null);
      }
      await loadServerFarms();
    } catch (error) {
      console.error('Error deleting farm:', error);
    }
  };

  const onFarmUpdated = async () => {
    await loadServerFarms();
    if (selectedFarm) {
      await handleFetchFarmDetails(selectedFarm.server_farm);
    }
  }

  return (
    <Container>
      <Heading as="h1" mb={4}>IP Tables Setup</Heading>
      {healthCheckFailed && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          Health check failed. Please check the backend service.
        </Alert>
      )}
      <Button onClick={onAddOpen} colorScheme="teal" mb={4} isDisabled={healthCheckFailed}>Add Server Farm</Button>
      <VStack spacing={4}>
        {serverFarms?.map((farm) => (
          <Box key={farm} w="100%">
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Text className="farm-name">{farm}</Text>
                {(selectedFarm?.server_farm === farm) ? <CloseButton onClick={() => setSelectedFarm(null)} /> : <Button onClick={() => handleFetchFarmDetails(farm)} colorScheme="blue">View Details</Button>}
                <Button onClick={() => handleDeleteFarm(farm)} colorScheme="red">Delete</Button>
              </Stack>
            </Box>
            {selectedFarm?.server_farm === farm && (
              <FarmDetails farm={selectedFarm} onFarmUpdated={onFarmUpdated} />
            )}
          </Box>
        ))}
      </VStack>
      <AddFarmForm isOpen={isAddOpen} onClose={onAddClose} onFarmAdded={loadServerFarms} />
    </Container>
  );
}

export default App;
