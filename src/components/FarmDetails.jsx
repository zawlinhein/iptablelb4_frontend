import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const FarmDetails = ({ farm }) => {
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
    </Box>
  );
};

export default FarmDetails;
