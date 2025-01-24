import { Box, Heading, Text, VStack, Button, useDisclosure } from '@chakra-ui/react';
import UpdateFarmForm from './UpdateFarmForm';

const FarmDetails = ({ farm, onFarmUpdated }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!farm) return null;

  return (
    <Box mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <Heading as="h2" size="md" mb={4}>Server Farm Details</Heading>
      <Text><strong>Server Farm:</strong> {farm.server_farm}</Text>
      <Text><strong>Algorithm:</strong> {farm.algorithm}</Text>
      <Text><strong>Port:</strong> {farm.port}</Text>
      <Heading as="h3" size="sm" mt={4}>Upstreams</Heading>
      <VStack spacing={2} mt={2}>
        {farm.upstreams.map((upstream, index) => (
          <Box key={index} p={2} borderWidth="1px" borderRadius="lg" w="100%">
            <Text><strong>IP Address:</strong> {upstream.ipaddress}</Text>
            <Text><strong>Port:</strong> {upstream.port}</Text>
          </Box>
        ))}
      </VStack>
      <Button onClick={onOpen} colorScheme="yellow" mt={4}>Update</Button>
      <UpdateFarmForm isOpen={isOpen} onClose={onClose} onFarmUpdated={onFarmUpdated} farmData={farm} />
    </Box>
  );
};

export default FarmDetails;
