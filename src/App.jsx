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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      if (selectedFarm.server_farm === farm) {
        setSelectedFarm(null);
      }
      loadServerFarms();
    } catch (error) {
      console.error('Error deleting farm:', error);
    }
  };

  return (
    <Container>
      <Heading as="h1" mb={4}>IP Tables Setup</Heading>
      {healthCheckFailed && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          Health check failed. Please check the backend service.
        </Alert>
      )}
      <Button onClick={onOpen} colorScheme="teal" mb={4} isDisabled={healthCheckFailed}>Add Server Farm</Button>
      <VStack spacing={4}>
        {serverFarms?.map((farm) => (
          <Box key={farm} p={4} borderWidth="1px" borderRadius="lg" w="100%">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Text>{farm}</Text>
              {selectedFarm?<CloseButton onClick={()=>setSelectedFarm(null)}/>:<Button onClick={() => handleFetchFarmDetails(farm)} colorScheme="blue">View Details</Button>}
              <Button onClick={() => handleDeleteFarm(farm)} colorScheme="red">Delete</Button>
            </Stack>
          </Box>
        ))}
      </VStack>
      <FarmDetails farm={selectedFarm} />
      <AddFarmForm isOpen={isOpen} onClose={onClose} onFarmAdded={loadServerFarms} />
    </Container>
  );
}

export default App;
